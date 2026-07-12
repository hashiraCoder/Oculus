import Joi from "joi";
import validate from "../utils/validator";

const createWorkspaceSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    type: Joi.string().valid('PERSONAL', 'ORGANIZATION').required(),
    github_installation_id: Joi.number().integer().allow(null).optional()
});

const validateCreateWorkspace = validate(createWorkspaceSchema)
export default validateCreateWorkspace