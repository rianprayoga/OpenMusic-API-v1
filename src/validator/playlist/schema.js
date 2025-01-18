const Joi = require('joi');

const PostPlaylistSchema = Joi.object({
  name: Joi.string().required().min(5).max(20)
    .not(''),
});

const SongIdSchema = Joi.object({
  songId: Joi.string().required().min(16).max(16)
    .not(''),
});

module.export = {
  PostPlaylistSchema,
  SongIdSchema,
};
