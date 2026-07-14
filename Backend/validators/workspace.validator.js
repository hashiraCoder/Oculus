import validate, { isInteger, toTrimmedString } from '../utils/validator.js';

const validateCreateWorkspaceInput = (body) => {
    const errors = [];
    const rawInstallationId = body?.github_installation_id;
    const value = {
        name: toTrimmedString(body?.name),
        type: toTrimmedString(body?.type).toUpperCase(),
        github_installation_id: rawInstallationId === null || rawInstallationId === undefined ? null : Number(rawInstallationId)
    };

    if (value.name.length < 3 || value.name.length > 255) {
        errors.push('Workspace name must be between 3 and 255 characters.');
    }

    if (!['PERSONAL', 'ORGANIZATION'].includes(value.type)) {
        errors.push('Workspace type must be PERSONAL or ORGANIZATION.');
    }

    if (value.github_installation_id !== null && (!isInteger(value.github_installation_id) || value.github_installation_id < 1)) {
        errors.push('GitHub installation ID must be a positive integer or null.');
    }

    return { value, errors };
};

const validateCreateWorkspace = validate(validateCreateWorkspaceInput)
export default validateCreateWorkspace