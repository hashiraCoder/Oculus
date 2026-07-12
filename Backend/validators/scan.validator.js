import Joi from "joi";
import validate from "../utils/validator";

const triggerScanSchema = Joi.object({
    repository_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    commit_hash: Joi.string().length(40).required(), // Git SHA-1 hashes are exactly 40 chars
    triggered_by: Joi.string().valid('WEBHOOK', 'MANUAL').required(),
    pr_number: Joi.number().integer().allow(null).optional()
});

const validateTriggerScan = validate(triggerScanSchema)

export default validateTriggerScan