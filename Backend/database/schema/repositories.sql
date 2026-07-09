CREATE TABLE repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    github_repo_id BIGINT UNIQUE NOT NULL,
    github_node_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    default_branch VARCHAR(100) DEFAULT 'main',
    visibility VARCHAR(50), 
    is_scanning_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_repo_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);