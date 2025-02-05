const { getId } = require('../utils/Identifier');
const InvariantError = require('../exceptions/InvariantError');

class LikeService {
  constructor(db) {
    this._db = db;
  }

  async like({ userId, albumId }) {
    if (await this.isLikeAlready({ userId, albumId })) {
      throw new InvariantError(`User ${userId} already liked this album.`);
    }

    await this._db.query({
      text: 'INSERT INTO userlikes("userId", "albumId") VALUES ($1, $2)',
      values: [userId, getId(albumId)],
    });
  }

  async getLike(albumId) {
    const result = await this._db.query({
      text: 'SELECT COUNT(1) as likevalue FROM userlikes WHERE "albumId"= $1 ',
      values: [getId(albumId)],
    });

    return result.rowCount === 0 ? 0 : result.rows[0].likevalue;
  }

  async isLikeAlready({ userId, albumId }) {
    const result = await this._db.query({
      text: `
                SELECT FROM userlikes ul
                WHERE 
                    ul."userId" = $1
                    AND
                    ul."albumId" = $2
            `,
      values: [userId, getId(albumId)],
    });

    return result.rowCount === 1;
  }

  async removeLike({ userId, albumId }) {
    const result = await this._db.query({
      text: 'DELETE FROM userlikes WHERE "userId" = $1 AND "albumId" = $2 RETURNING "userId"',
      values: [userId, getId(albumId)],
    });

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete.');
    }
  }
}

module.exports = LikeService;
