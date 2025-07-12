const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING *',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new InvariantError(`Failed adding album '${name}'`);
    }

    return rows[0];
  }

  async getAlbumById(id) {
    let query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Album with id '${id}' was not found`);
    }

    const album = rows[0];
    query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    const result = await this._pool.query(query);
    const songs = result.rows.map((s) => ({
      id: s.id,
      title: s.id,
      performer: s.performer,
    }));

    return { ...album, songs };
  }

  async updateAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET (name, year) = ($1, $2) WHERE id = $3 RETURNING *',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new NotFoundError(`Failed updating album with id '${id}'`);
    }

    return rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 returning id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Album with id '${id}' was not found`);
    }

    return rows[0];
  }
}

module.exports = { AlbumService };
