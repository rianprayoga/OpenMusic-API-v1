const Joi = require('joi');

const PostUserBodySchema = Joi.object({
  username: Joi.string().required().min(3).max(20)
    .not(''),
  password: Joi.string().required().min(3).max(20)
    .not(''),
  fullname: Joi.string().required().min(3).max(20)
    .not(''),
});

const AuthBodySchema = Joi.object({
  username: Joi.string().required().min(3).max(20)
    .not(''),
  password: Joi.string().required().min(3).max(20)
    .not(''),
});

const RefreshTokebBodySchema = Joi.object({
  refreshToken: Joi.string().required().not(''),
});

module.exports = {
  AuthBodySchema,
  PostUserBodySchema,
  RefreshTokebBodySchema,
};
