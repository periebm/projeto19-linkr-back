import Joi from "joi";

export const followSchema = Joi.object({
    following_id: Joi.number().integer().required()
  });