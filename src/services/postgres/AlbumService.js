const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { albumMapper } = require('../../mappers/albumMapper');

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
    const query = {
      text: `
        SELECT a.id, a.name, a.year, a.cover_url,
          COALESCE(json_agg(json_build_object('id', s.id, 'title', s.title, 'performer', s.performer)) 
          FILTER (WHERE s.id IS NOT NULL), '[]') as songs
        FROM albums a
        LEFT JOIN songs s ON s.album_id = a.id
        WHERE a.id = $1
        group by a.id
      `,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Album with id '${id}' was not found`);
    }

    return albumMapper.fromDb(rows[0]);
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

  async verifyAlbumExists(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Album with id '${id}' was not found`);
    }

    return true;
  }

  async addAlbumCover(id, url) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [url, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Album with id ${id} was not found`);
    }
  }
}

module.exports = { AlbumService };
