import config from '../../config/env.js';
import { buildAccessToken, buildRefreshToken, hashToken } from '../../utils/jwt.js';
import { listUserWorkspaces } from '../../repositories/workspace.repository.js';

const hydrateUserWorkspaces = async (client, userId) => {
    const workspaceRows = await listUserWorkspaces(client, userId);

    const workspaces = workspaceRows.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        role: workspace.role
    }));

    return {
        workspaces,
        defaultWorkspaceId: workspaces[0]?.id || null
    };
};

export const issueSession = async (client, user) => {
    const { workspaces, defaultWorkspaceId } = await hydrateUserWorkspaces(client, user.id);
    const accessToken = buildAccessToken(user, defaultWorkspaceId);
    const refreshToken = buildRefreshToken(user, user.token_version);
    const refreshTokenHash = hashToken(refreshToken);

    await client.query(
        `INSERT INTO refresh_sessions (user_id, token_hash, token_version, expires_at)
         VALUES ($1, $2, $3, NOW() + ($4::interval))`,
        [user.id, refreshTokenHash, user.token_version, config.jwt.refreshExpiresIn]
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.global_role,
            is_verified: user.is_verified
        },
        workspaces,
        accessToken,
        refreshToken
    };
};

export const rotateRefreshSession = async (client, user, currentSessionId) => {
    const { workspaces, defaultWorkspaceId } = await hydrateUserWorkspaces(client, user.id);

    await client.query(
        'UPDATE refresh_sessions SET revoked_at = NOW() WHERE id = $1',
        [currentSessionId]
    );

    const accessToken = buildAccessToken(user, defaultWorkspaceId);
    const nextRefreshToken = buildRefreshToken(user, user.token_version);
    const nextRefreshTokenHash = hashToken(nextRefreshToken);

    await client.query(
        `INSERT INTO refresh_sessions (user_id, token_hash, token_version, expires_at)
         VALUES ($1, $2, $3, NOW() + ($4::interval))`,
        [user.id, nextRefreshTokenHash, user.token_version, config.jwt.refreshExpiresIn]
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.global_role,
            is_verified: user.is_verified
        },
        workspaces,
        accessToken,
        refreshToken: nextRefreshToken
    };
};
