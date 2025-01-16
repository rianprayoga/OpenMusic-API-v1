const { nanoid } = require('nanoid');
const { getId, generateSongId: songId } = require('../utils/Identifier');
const { songResponse, songExtendedResponse } = require('../utils/Response');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongsService {
  constructor(db) {
    this._db = db;
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    this.validateAlbumId(albumId);

    const id = nanoid(16);
    const result = await this._db.query({
      text:
          `INSERT 
            INTO songs(id, title, year, genre, performer, duration, albumId)
            VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      values: [id, title, year, genre, performer, duration, getId(albumId)],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song.');
    }

    return songId(result.rows[0].id);
  }

  async getSongs() {
    const result = await this._db.query({
      text: 'SELECT id, title, performer FROM songs',
      values: [],
    });

    return result.rows.map(songResponse);
  }

  async getSong(id) {
    const result = await this._db.query({
      text:
          `SELECT id, title, year, genre, performer, duration, albumId
          FROM songs s WHERE id = $1`,
      values: [getId(id)],
    });

    if (result.rows.length === 0) {
      throw new NotFoundError(`Song with id ${id} not found.`);
    }

    return result.rows.map(songExtendedResponse)[0];
  }

  async updateSong(id, {
    title, year, genre, performer, duration, albumdId,
  }) {
    this.validateAlbumId(albumdId);

    const queryValue = {
      text: 'UPDATE songs SET title= $1, year= $2, genre=$3, performer=$4, duration=$5, albumid=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, getId(albumdId), getId(id)],
    };

    const result = await this._db.query(queryValue);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to update song. Song with Id ${id} not found.`);
    }
  }

  async deleteSong(id) {
    const queryValue = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [getId(id)],
    };

    const result = await this._db.query(queryValue);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to delete. Song with id ${id} not found.`);
    }
  }

  async validateAlbumId(id) {
    if (id !== undefined) {
      const result = await this._db.query({
        text: 'SELECT id FROM albums a WHERE a.id = $1',
        values: [getId(id)],
      });

      if (result.rows.length === 0) {
        throw new InvariantError(`Album with id ${id} not found.`);
      }
    }
  }
}

module.exports = SongsService;
