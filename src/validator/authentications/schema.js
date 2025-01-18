const Joi = require('joi');

const PostAuthBodySchema = Joi.object({
  username: Joi.string().required().min(5).max(20),
  password: Joi.string().required().min(5).max(20),
  fullname: Joi.string().required().min(5).max(20),
});

const PutAuthBodySchema = Joi.object({
  refreshToken: Joi.string().required().not(''),
});

const DeleteAuthBodySchema = Joi.object({
  refreshToken: Joi.string().required().not(''),
});

module.exports = {
  PostAuthBodySchema,
  PutAuthBodySchema,
  DeleteAuthBodySchema,
};
