import { getPool } from '../../config/db.js';
import ApiError from '../../utils/apiError.js';
import { hashToken, verifyRefreshToken } from '../../utils/jwt.js';
import { findUserForSessionByRefreshHash } from '../../repositories/user.repository.js';
import { rotateRefreshSession } from './session.service.js';

export const refreshSession = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, 'Refresh token is required.');
    }

    const pool = getPool();
    const client = await pool.connect();
    const tokenHash = hashToken(refreshToken);

    try {
        const decoded = verifyRefreshToken(refreshToken);

        await client.query('BEGIN');

        const session = await findUserForSessionByRefreshHash(client, tokenHash);

        if (!session || session.user_id !== decoded.sub || session.token_version !== decoded.tokenVersion || session.current_token_version !== decoded.tokenVersion) {
            if (session?.session_id) {
                await client.query(
                    'UPDATE refresh_sessions SET revoked_at = NOW() WHERE id = $1',
                    [session.session_id]
                );

                await client.query('COMMIT');
            } else {
                await client.query('ROLLBACK');
            }

            throw new ApiError(401, 'Invalid refresh token.');
        }

        await client.query(
            'UPDATE refresh_sessions SET last_used_at = NOW() WHERE id = $1',
            [session.session_id]
        );

        const user = {
            id: session.id,
            email: session.email,
            global_role: session.global_role,
            is_verified: session.is_verified,
            token_version: session.current_token_version
        };

        const rotatedSession = await rotateRefreshSession(client, user, session.session_id);

        await client.query('COMMIT');

        return {
            isDuplicate: false,
            ...rotatedSession
        };
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch {
            // Ignore cleanup failures after a committed transaction.
        }
        throw error;
    } finally {
        client.release();
    }
};
