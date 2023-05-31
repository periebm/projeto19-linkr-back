import Joi from "joi";

const authSchemas = {
  schemaSignUp: Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(3).required(),
    pictureUrl: Joi.string().uri().min(1).required(),
  }).unknown(true),

  schemaLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  }).unknown(true),
};

export default authSchemas;