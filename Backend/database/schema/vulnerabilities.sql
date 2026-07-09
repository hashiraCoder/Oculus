CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL,
    rule_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    line_number INT,
    encrypted_snippet TEXT,
    is_false_positive BOOLEAN NOT NULL DEFAULT FALSE,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vuln_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);