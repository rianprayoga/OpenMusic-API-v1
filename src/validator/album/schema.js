const Joi = require('joi');

const AlbumBodySchema = Joi.object({
  name: Joi.string().required().min(3)
    .max(100),
  year: Joi.number().integer().positive().required(),
});

module.exports = { AlbumBodySchema };
