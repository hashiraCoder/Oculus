export const createWorkspace = async (client, name, type = 'PERSONAL', githubInstallationId = null) => {
    const result = await client.query(
        `INSERT INTO workspaces (name, type, github_installation_id)
         VALUES ($1, $2, $3)
         RETURNING id, name, type, github_installation_id, created_at`,
        [name, type, githubInstallationId]
    );

    return result.rows[0];
};

export const addUserWorkspace = async (client, userId, workspaceId, role = 'OWNER') => {
    await client.query(
        `INSERT INTO users_workspaces (user_id, workspace_id, role)
         VALUES ($1, $2, $3)`,
        [userId, workspaceId, role]
    );
};

export const listUserWorkspaces = async (client, userId) => {
    const result = await client.query(
        `SELECT
            w.id,
            w.name,
            uw.role,
            uw.joined_at
         FROM users_workspaces uw
         INNER JOIN workspaces w ON w.id = uw.workspace_id
         WHERE uw.user_id = $1
         ORDER BY CASE WHEN uw.role = 'OWNER' THEN 0 ELSE 1 END, uw.joined_at ASC, w.created_at ASC`,
        [userId]
    );

    return result.rows;
};
