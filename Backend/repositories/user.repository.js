export const findUserIdByEmail = async (client, email) => {
    const result = await client.query(
        'SELECT id FROM users WHERE email = $1 LIMIT 1',
        [email]
    );

    return result.rows[0] || null;
};

export const findAuthUserByEmail = async (client, email) => {
    const result = await client.query(
        `SELECT id, email, password_hash, global_role, is_verified, token_version
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [email]
    );

    return result.rows[0] || null;
};

export const createUser = async (client, email, passwordHash) => {
    const result = await client.query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email, global_role, is_verified, created_at`,
        [email, passwordHash]
    );

    return result.rows[0];
};

export const touchLastLogin = async (client, userId) => {
    await client.query(
        'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
        [userId]
    );
};

export const findUserForSessionByRefreshHash = async (client, tokenHash) => {
    const result = await client.query(
        `SELECT
            rs.id AS session_id,
            rs.user_id,
            rs.token_version,
            rs.revoked_at,
            rs.expires_at,
            u.id,
            u.email,
            u.global_role,
            u.is_verified,
            u.token_version AS current_token_version
         FROM refresh_sessions rs
         INNER JOIN users u ON u.id = rs.user_id
         WHERE rs.token_hash = $1
           AND rs.revoked_at IS NULL
           AND rs.expires_at > NOW()
         LIMIT 1`,
        [tokenHash]
    );

    return result.rows[0] || null;
};
