const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const { generateUserId } = require('../utils/Identifier');

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add user.');
    }
    return generateUserId(result.rows[0].id);
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._db.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(`Failed to add user. Username ${username} has been used.`);
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._db.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError(`User ${username} not found.`);
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Mismatch credential.');
    }
    return id;
  }
}

module.exports = UsersService;
