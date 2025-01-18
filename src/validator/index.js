const InvariantError = require('../exceptions/InvariantError');
const { SongBodySchema } = require('./song/schema');
const { AlbumBodySchema } = require('./album/schema');
const {
  PostAuthBodySchema,
  PutAuthBodySchema,
  DeleteAuthBodySchema,
} = require('./authentications/schema');

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
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthBodySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = Validator;
