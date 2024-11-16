import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
  HARDCODED_JWT: Joi.string().required(),
});
