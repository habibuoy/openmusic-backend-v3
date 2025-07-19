const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../errors/InvariantError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { AuthorizationError } = require('../../errors/AuthorizationError');
const PlaylistActivityActionType = require('../PlaylistActivityActionType');
const { playlistMapper } = require('../../mappers/playlistMapper');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, ownerId }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, ownerId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError(`Failed to add playlist ${name}`);
    }

    return rows[0].id;
  }

  async getPlaylists(ownerId) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username 
        FROM playlists p
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        INNER JOIN users u ON u.id = p.owner_id
        WHERE p.owner_id = $1 OR c.user_id = $1
      `,
      values: [ownerId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username, 
          COALESCE(songs.array, '[]') as songs
        FROM playlists p
        INNER JOIN users u ON p.owner_id = u.id
        LEFT JOIN (
          SELECT ps.playlist_id,
            json_agg(
              json_build_object('id', s.id, 'title', s.title, 'performer', s.performer)
            ) AS array
          FROM playlist_songs ps
          INNER JOIN songs s ON s.id = ps.song_id
          GROUP BY ps.playlist_id
        ) songs ON songs.playlist_id = p.id 
        WHERE p.id = $1
      `,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Playlist with id ${id}} was not found`);
    }

    return rows[0];
  }

  async getActivities(id) {
    const query = {
      text: `
        SELECT p.id AS playlist_id,
          COALESCE(a.activities, '[]') activities
        FROM playlists p
        INNER JOIN (
          SELECT playlist_id, json_agg(
            json_build_object(
              'username', u.username, 
              'title', s.title, 
              'action', pa.action,
              'time', pa.time
            ) ORDER BY pa.time
          ) activities
          FROM playlist_activities pa
          LEFT JOIN users u ON u.id = pa.user_id
          INNER JOIN songs s ON s.id = pa.song_id
          GROUP BY pa.playlist_id
        ) a ON a.playlist_id = p.id
        WHERE p.id = $1
      `,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Playlist with id ${id}} was not found`);
    }

    return playlistMapper.activitiesFromDb(rows[0]);
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, songId, playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError(`Failed to add song with id ${songId} to playlist with id ${playlistId}`);
    }
  }

  async addPlaylistActivity({
    playlistId,
    songId,
    userId,
    action = PlaylistActivityActionType.ERR,
  }) {
    const id = `actv-${nanoid(16)}`;
    const inputTime = (new Date()).toISOString();

    const query = {
      text: 'INSERT INTO playlist_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, inputTime],
    };

    await this._pool.query(query);
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Playlist with id ${id} was not found`);
    }

    return rows[0].id;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError(`Failed to delete song with id ${songId} from playlist with id ${playlistId}`);
    }
  }

  async deleteSongFromPlaylists(songId) {
    const query = {
      text: `
        DELETE FROM playlist_songs
        WHERE song_id = $1 RETURNING playlist_id
      `,
      values: [songId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map(playlistMapper.playlistIdsFromDb);
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner_id FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(`Playlist with id ${playlistId} was not found`);
    }

    const { owner_id: ownerId } = rows[0];

    if (ownerId !== userId) {
      throw new AuthorizationError('You are not allowed to access this resource');
    }
  }
}

module.exports = { PlaylistService };
