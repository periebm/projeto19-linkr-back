import Joi from "Joi";

const commentSchema = Joi.object({
    postId: Joi.number().integer().required(),
    content: Joi.string().required()
});

export default commentSchema;