import { getPool } from '../../config/db.js';
import ApiError from '../../utils/apiError.js';
import { hashToken } from '../../utils/jwt.js';

export const logoutSession = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required for logout.');
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
        const tokenHash = hashToken(refreshToken);

        await client.query(
            `UPDATE refresh_sessions
             SET revoked_at = NOW()
             WHERE token_hash = $1
               AND revoked_at IS NULL`,
            [tokenHash]
        );

        return { success: true };
    } finally {
        client.release();
    }
};
