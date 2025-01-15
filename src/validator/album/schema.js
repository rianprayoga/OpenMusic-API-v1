const Joi = require('joi');

const AlbumBodySchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
});

module.exports = { AlbumBodySchema };
