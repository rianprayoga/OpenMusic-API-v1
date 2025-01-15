const InvariantError = require('../../exceptions/InvariantError');
const { AlbumBodySchema } = require('./schema');

const AlbumValidator = {
  validateAlbumBody: (payload) => {
    const validationResult = AlbumBodySchema.validate(payload);
    if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
