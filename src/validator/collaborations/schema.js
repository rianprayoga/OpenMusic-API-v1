const Joi = require('joi');

const CollabSchema = Joi.object({
  playlistId: Joi.string().required().min(1).max(25)
    .not(''),
  userId: Joi.string().required().min(1).max(21)
    .not(''),
});

module.exports = CollabSchema;
