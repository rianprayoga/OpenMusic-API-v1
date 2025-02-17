const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');
const { getId } = require('../utils/Identifier');

class AuthorizationService {
  constructor(db) {
    this._db = db;
  }

  async validateOwner({ playlistId, userId }) {
    if (!await this.isOwner({ playlistId, userId })) {
      throw new AuthorizationError('User forbidden to access this resource.');
    }
  }

  async isOwner({ playlistId, userId }) {
    const r = await this._db.query({
      text: `
            SELECT p.owner  FROM playlist p 
            WHERE 
                p.id = $1
        `,
      values: [getId(playlistId)],
    });

    if (r.rowCount === 0) {
      throw new NotFoundError(`Playlist ${playlistId} not found.`);
    }

    return r.rows[0].owner === getId(userId);
  }

  async validateAccess({ playlistId, userId }) {
    if (!await this.isOwner({ playlistId, userId })) {
      const result = await this._db.query({
        text: `
                  select c.id from collaborations c
                  where c."playlistId" = $1 and c."userId" = $2
                  `,
        values: [getId(playlistId), getId(userId)],
      });

      if (result.rowCount === 0) {
        throw new AuthorizationError('User forbidden to access this resource.');
      }
    }
  }
}

module.exports = AuthorizationService;
