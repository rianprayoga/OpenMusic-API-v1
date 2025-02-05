const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { generateAlbumdId: albumdId, getId } = require('../utils/Identifier');
const { albumResponse, songResponse } = require('../utils/Response');

class AlbumsService {
  constructor(db) {
    this._db = db;
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const queryValue = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)  RETURNING id',
      values: [id, name, year],
    };

    const result = await this._db.query(queryValue);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album.');
    }

    return albumdId(result.rows[0].id);
  }

  async getAlbumById(id) {
    const result = await this._db.query(
      {
        text:
        `SELECT 
          a.id as aid, a.name, a.year, a.cover, s.id as sid, s.title, s.performer
        FROM albums a LEFT JOIN songs s ON a.id = s.albumId WHERE a.id = $1`,
        values: [getId(id)],
      },
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`Album with id ${id} not found.`);
    }

    const tmpSongs = result
      .rows
      .map(({ sid, title, performer }) => songResponse({ id: sid, title, performer }));

    const {
      aid, name, year, cover,
    } = result.rows[0];
    return albumResponse({
      id: aid, name, year, songs: tmpSongs[0].id === undefined ? [] : tmpSongs, coverUrl: cover,
    });
  }

  async deleteAlbumById(id) {
    const queryValue = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [getId(id)],
    };

    const result = await this._db.query(queryValue);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to delete. Album with id ${id} not found.`);
    }
  }

  async updateAlbumById(id, { name, year }) {
    const queryValue = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, getId(id)],
    };

    const result = await this._db.query(queryValue);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to update album. Album with Id ${id} not found.`);
    }
  }

  async addCover({ id, location }) {
    const queryValue = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [location, getId(id)],
    };

    const result = await this._db.query(queryValue);

    if (!result.rowCount) {
      throw new NotFoundError(`Failed to update cover. Album with Id ${id} not found.`);
    }
  }
}

module.exports = AlbumsService;
