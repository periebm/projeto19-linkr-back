import Joi from "joi";

export const postSchema = Joi.object({
  description: Joi.string(),
  user_id: Joi.number().integer().required(),
  url: Joi.string().required().uri()
});

export const likeSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  post_id: Joi.number().integer().required()
});