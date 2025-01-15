const Joi = require('joi');

const SongBodySchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  year: Joi.number().integer().positive().required(),
  genre: Joi.string().required().min(3).max(100),
  performer: Joi.string().required().min(3).max(100),
  duration: Joi.number().integer().positive(),
  albumId: Joi.string().min(22).max(22),
});

module.exports = { SongBodySchema };
