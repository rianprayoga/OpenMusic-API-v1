const InvariantError = require('../exceptions/InvariantError');
const { SongBodySchema } = require('./song/schema');
const { AlbumBodySchema } = require('./album/schema');

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
};

module.exports = Validator;
