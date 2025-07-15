const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { InvariantError } = require('../../errors/InvariantError');
const { AuthenticationError } = require('../../errors/AuthenticationError');
const { NotFoundError } = require('../../errors/NotFoundError');

const PasswordHashRoundCount = 10;

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, PasswordHashRoundCount);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add user');
    }

    return rows[0].id;
  }

  async getUser(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`User with id ${id} was not found`);
    }

    return rows[0];
  }

  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new AuthenticationError('Incorrect credentials');
    }

    const { id, password: hashedPassword } = rows[0];

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new AuthenticationError('Incorrect credentials');
    }

    return id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length && rows.length > 0) {
      throw new InvariantError(`Failed to add user. Username ${username} already exists`);
    }
  }
}

module.exports = { UserService };
