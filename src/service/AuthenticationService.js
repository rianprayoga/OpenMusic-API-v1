const InvariantError = require('../exceptions/InvariantError');

class AuthenticationServie {
  constructor(db) {
    this._db = db;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._db.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT "refreshToken" FROM authentications WHERE "refreshToken" = $1',
      values: [token],
    };

    const result = await this._db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Invalid refresh token.');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE "refreshToken" = $1',
      values: [token],
    };

    await this._db.query(query);
  }
}

module.exports = AuthenticationServie;
