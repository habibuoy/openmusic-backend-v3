const { Pool } = require('pg');
const InvariantError = require('../../errors/InvariantError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }
}

module.exports = { SongService };
