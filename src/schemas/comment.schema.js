import Joi from "joi";

const commentSchema = Joi.object({
    postId: Joi.number().integer().required(),
    content: Joi.string().required()
});

export default commentSchema;