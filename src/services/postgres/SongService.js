const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { songMapper } = require('../../mappers/songMapper');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new InvariantError(`Failed adding song ${title}`);
    }

    return rows.map(songMapper.fromDb)[0];
  }

  async getSongs(songQuery) {
    let { title, performer } = songQuery;

    const queryOperator = title !== undefined && performer !== undefined
      ? 'AND'
      : 'OR';

    if (title === undefined && performer === undefined) {
      title = '';
      performer = '';
    }

    const query = {
      text: `SELECT * FROM songs 
        WHERE title ilike $1 ${queryOperator}
          performer ilike $2`,
      values: [`${title}%`, `${performer}%`],
    };

    const result = await this._pool.query(query);

    return result.rows.map(songMapper.fromDb);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new NotFoundError(`Song with id ${id} was not found`);
    }

    return rows.map(songMapper.fromDb)[0];
  }

  async updateSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET (title, year, genre, performer, duration, album_id) = ($1, $2, $3, $4, $5, $6) WHERE id = $7 RETURNING *',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new NotFoundError(`Failed updating song with id ${id}`);
    }

    return rows.map(songMapper.fromDb)[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows.length) {
      throw new NotFoundError(`Song with id ${id} was not found`);
    }

    return rows.map[0];
  }
}

module.exports = { SongService };
