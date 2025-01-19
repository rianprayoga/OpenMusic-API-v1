const { nanoid } = require('nanoid');
const { getId } = require('../utils/Identifier');
const InvariantError = require('../exceptions/InvariantError');

class AuditService {
  constructor(db) {
    this._db = db;
  }

  async createAudit({
    playlistId, songId, actor, action,
  }) {
    const id = nanoid(16);

    const result = await this._db.query({
      text: `
            INSERT INTO activities(id, "playlistId", "songId", "userId", "action")
            VALUES($1, $2, $3, $4, $5)
            RETURNING id
            `,
      values: [id, getId(playlistId), getId(songId), getId(actor), action],
    });

    if (result.rowCount === 0) {
      throw new InvariantError('Failed to save audit.');
    }
  }

  async getAudits(playlistId) {
    const result = await this._db.query({
      text: `
            SELECT 
                u."username", s.title, a.action, a.time FROM activities a
            LEFT JOIN songs s ON s.id = a."songId"
            LEFT JOIN users u ON u.id = a."userId"
            WHERE a."playlistId" = $1
            ORDER BY a.time ASC
        `,
      values: [getId(playlistId)],
    });

    const activities = result.rows;

    return {
      playlistId,
      activities,
    };
  }
}

module.exports = AuditService;
