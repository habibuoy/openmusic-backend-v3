const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');

class LikeService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO user_album_likes VALUES ($1, $2, $3)
        ON CONFLICT (user_id, album_id) DO NOTHING
        RETURNING id
      `,
      values: [id, userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('User has already liked this album');
    }

    return rows[0].id;
  }

  async getLikesCount(albumId) {
    const query = {
      text: `
        SELECT COUNT(album_id) 
        FROM user_album_likes 
        WHERE album_id = $1
      `,
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);

    return +rows[0].count;
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: `
        DELETE FROM user_album_likes
        WHERE user_id = $1 AND album_id = $2
        RETURNING id
      `,
      values: [userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('User hasn\'t like this album');
    }

    return rows[0].id;
  }
}

module.exports = { LikeService };
