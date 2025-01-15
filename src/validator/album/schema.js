const Joi = require('joi');

const AlbumBodySchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
  .integer().required(),
});

module.exports = { AlbumBodySchema };
