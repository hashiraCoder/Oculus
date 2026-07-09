CREATE TYPE global_role_enum AS ENUM ('ADMIN', 'DEVELOPER');
CREATE TYPE workspace_type_enum AS ENUM ('PERSONAL', 'ORGANIZATION');
CREATE TYPE workspace_role_enum AS ENUM ('OWNER', 'MEMBER');
CREATE TYPE scan_status_enum AS ENUM ('QUEUED', 'SCANNING', 'PASSED', 'FAILED');
CREATE TYPE trigger_type_enum AS ENUM ('WEBHOOK', 'MANUAL');