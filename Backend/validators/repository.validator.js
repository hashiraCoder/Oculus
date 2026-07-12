import Joi from "joi";
import validate from "../utils/validator";

const addRepositorySchema = Joi.object({
    workspace_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    github_repo_id: Joi.number().integer().required(),
    name: Joi.string().required(),
    full_name: Joi.string().required(),
    visibility: Joi.string().valid('public', 'private').required(),
    default_branch: Joi.string().default('main')
});
const validateAddRepository = validate(addRepositorySchema)

export default validateAddRepository
