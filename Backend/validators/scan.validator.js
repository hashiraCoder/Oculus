import validate, { isInteger, isUUID, toTrimmedString } from '../utils/validator.js';

const validateTriggerScanInput = (body) => {
    const errors = [];
    const value = {
        repository_id: toTrimmedString(body?.repository_id),
        commit_hash: toTrimmedString(body?.commit_hash),
        triggered_by: toTrimmedString(body?.triggered_by).toUpperCase(),
        pr_number: body?.pr_number === null || body?.pr_number === undefined ? null : Number(body?.pr_number)
    };

    if (!isUUID(value.repository_id)) {
        errors.push('repository_id must be a valid UUID.');
    }

    if (!/^[0-9a-f]{40}$/i.test(value.commit_hash)) {
        errors.push('commit_hash must be a 40 character Git SHA.');
    }

    if (!['WEBHOOK', 'MANUAL'].includes(value.triggered_by)) {
        errors.push('triggered_by must be WEBHOOK or MANUAL.');
    }

    if (value.pr_number !== null && (!isInteger(value.pr_number) || value.pr_number < 1)) {
        errors.push('pr_number must be a positive integer or null.');
    }

    return { value, errors };
};

const validateTriggerScan = validate(validateTriggerScanInput)

export default validateTriggerScan