const Joi = require('joi');

const PostPlaylistSchema = Joi.object({
  name: Joi.string().required().min(5).max(100)
    .not(''),
});

const SongIdSchema = Joi.object({
  songId: Joi.string().required().min(1).max(21)
    .not(''),
});

module.exports = {
  PostPlaylistSchema,
  SongIdSchema,
};
