import crypto from 'node:crypto';
import { getPool } from '../../config/db.js';
import { hashToken } from '../../utils/jwt.js';
import { normalizeEmail } from '../../utils/loginLimiter.js';
import { findUserIdByEmail } from '../../repositories/user.repository.js';
import { createPasswordReset, deletePasswordResetsByUser } from '../../repositories/password-reset.repository.js';

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MINUTES = 60;

const buildResetToken = () => crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');

const deliverPasswordResetEmail = async ({ email, resetToken }) => {
    void resetToken;

    if (process.env.NODE_ENV !== 'production') {
        console.info(`Password reset requested for ${email}. Configure email delivery to send links in production.`);
    }
};

export const forgotPassword = async (email) => {
    const normalizedEmail = normalizeEmail(email);
    const pool = getPool();
    const client = await pool.connect();
    const resetToken = buildResetToken();

    try {
        await client.query('BEGIN');

        const user = await findUserIdByEmail(client, normalizedEmail);
        const tokenHash = hashToken(resetToken);

        if (user?.id) {
            await deletePasswordResetsByUser(client, user.id);

            const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000).toISOString();
            await createPasswordReset(client, user.id, tokenHash, expiresAt);
        }

        await client.query('COMMIT');

        await deliverPasswordResetEmail({ email: normalizedEmail, resetToken });

        return { success: true };
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch {
            // Ignore rollback cleanup failures.
        }

        throw error;
    } finally {
        client.release();
    }
};