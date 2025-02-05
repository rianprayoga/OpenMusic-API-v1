const Joi = require('joi');

const AlbumBodySchema = Joi.object({
  name: Joi.string().required().min(3)
    .max(100),
  year: Joi.number().integer().positive().required(),
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
    ).required(),
}).unknown();

module.exports = { AlbumBodySchema, ImageHeadersSchema };
