CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID NOT NULL,
    pr_number INT,
    commit_hash VARCHAR(40) NOT NULL,
    status scan_status_enum NOT NULL DEFAULT 'QUEUED',
    triggered_by trigger_type_enum NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    duration_ms BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scan_repository FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE
);