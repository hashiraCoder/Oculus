import validate, { isInteger, isUUID, toTrimmedString } from '../utils/validator.js';

const validateAddRepositoryInput = (body) => {
    const errors = [];
    const visibility = toTrimmedString(body?.visibility).toLowerCase();
    const value = {
        workspace_id: toTrimmedString(body?.workspace_id),
        github_repo_id: Number(body?.github_repo_id),
        name: toTrimmedString(body?.name),
        full_name: toTrimmedString(body?.full_name),
        visibility,
        default_branch: toTrimmedString(body?.default_branch) || 'main'
    };

    if (!isUUID(value.workspace_id)) {
        errors.push('workspace_id must be a valid UUID.');
    }

    if (!isInteger(value.github_repo_id) || value.github_repo_id < 1) {
        errors.push('github_repo_id must be a positive integer.');
    }

    if (!value.name) {
        errors.push('name is required.');
    }

    if (!value.full_name) {
        errors.push('full_name is required.');
    }

    if (!['public', 'private'].includes(visibility)) {
        errors.push('visibility must be public or private.');
    }

    return { value, errors };
};

const validateAddRepository = validate(validateAddRepositoryInput)

export default validateAddRepository
