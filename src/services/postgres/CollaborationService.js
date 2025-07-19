const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { AuthorizationError } = require('../../errors/AuthorizationError');

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add collaboration');
    }

    return rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Collaboration was not found');
    }
  }

  async verifyCollaboration({ playlistId, userId }) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new AuthorizationError('You are not authorized to access this collab resource');
    }

    return rows[0].id;
  }
}

module.exports = { CollaborationService };
