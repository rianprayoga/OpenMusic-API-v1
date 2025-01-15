const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { albumdId, getId } = require('../utils/Identifier');
const { albumResponse } = require('../utils/Response');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)  RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add albums.');
    }

    return albumdId(result.rows[0].id);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums a WHERE a.id = $1',
      values: [getId(id)],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new NotFoundError(`Album with id ${id} not found.`);
    }

    return result.rows.map(albumResponse)[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [getId(id)],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to delete. Album with id ${id} not found.`);
    }
  }

  async updateAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, getId(id)],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to update album.Album with Id ${id} not found.`);
    }
  }
}

module.exports = AlbumsService;
