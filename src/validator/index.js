const InvariantError = require('../exceptions/InvariantError');
const { SongBodySchema } = require('./song/schema');
const { AlbumBodySchema } = require('./album/schema');
const {
  AuthBodySchema,
  PostUserBodySchema,
  RefreshTokebBodySchema,
} = require('./authentications/schema');
const { PostPlaylistSchema, SongIdSchema } = require('./playlist/schema');
const CollabSchema = require('./collaborations/schema');

const Validator = {
  validateSongBody: (payload) => {
    const validationResult = SongBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumBody: (payload) => {
    const validationResult = AlbumBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostUserPayload: (payload) => {
    const validationResult = PostUserBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRefreshTokenBody: (payload) => {
    const validationResult = RefreshTokebBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAuthBody: (payload) => {
    const validationResult = AuthBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistBody: (payload) => {
    const validationResult = PostPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongIdBody: (payload) => {
    const validationResult = SongIdSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCollabBody: (payload) => {
    const validationResult = CollabSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = Validator;
