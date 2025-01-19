const { nanoid } = require('nanoid');
const { getId, collabId } = require('../utils/Identifier');
const InvariantError = require('../exceptions/InvariantError');

class CollabsService {
  constructor(db) {
    this._db = db;
  }

  async addCollaboration({ playlistId, userId }) {
    if (await this.isCollabsExist({ playlistId, userId })) {
      throw new InvariantError(`User ${userId} already in collaboration.`);
    }

    const id = nanoid(16);
    const result = await this._db.query({
      text: `
                INSERT INTO collaborations(id, "playlistId", "userId")
                VALUES($1, $2, $3)
                RETURNING id
                `,
      values: [id, getId(playlistId), getId(userId)],
    });

    if (result.rows.length === 0) {
      throw new InvariantError('Failed to add user.');
    }
    return collabId(result.rows[0].id);
  }

  async deleteCollaboration({ playlistId, userId }) {
    if (!await this.isCollabsExist({ playlistId, userId })) {
      throw new InvariantError('Collaboration not found.');
    }

    await this._db.query({
      text: `
                 DELETE FROM collaborations
                  WHERE "playlistId"=$1 AND "userId"=$2
                `,
      values: [getId(playlistId), getId(userId)],
    });
  }

  async isCollabsExist({ playlistId, userId }) {
    const result = await this._db.query({
      text: `
                SELECT id FROM collaborations c
                WHERE 
                    c."playlistId"= $1 AND c."userId"= $2
            `,
      values: [getId(playlistId), getId(userId)],
    });

    return result.rowCount === 1;
  }
}

module.exports = CollabsService;
