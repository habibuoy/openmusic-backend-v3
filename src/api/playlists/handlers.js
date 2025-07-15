const { AuthorizationError } = require('../../errors/AuthorizationError');
const { ClientError } = require('../../errors/ClientError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { succeed, created } = require('../responseObject');

class PlaylistHandler {
  constructor(
    playlistService,
    songService,
    collaborationService,
    playlistValidator,
  ) {
    this._service = playlistService;
    this._songService = songService;
    this._collaborationService = collaborationService;
    this._validator = playlistValidator;
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { name } = request.payload;

    const result = await this._service.addPlaylist({ name, ownerId: userId });

    return created(h, {
      data: {
        playlistId: result,
      },
    });
  }

  async getPlaylistsHandler(request, h) {
    const { userId } = request.auth.credentials;

    const result = await this._service.getPlaylists(userId);

    return succeed(h, {
      data: {
        playlists: result,
      },
    });
  }

  async deletePlaylistsHandler(request, h) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, userId);
    await this._service.deletePlaylist(id);

    return succeed(h, {
      message: 'Successfully deleted playlist',
    });
  }

  async postSongsHandler(request, h) {
    this._validator.validatePostSongPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id } = request.params;

    await this._verifyPlaylistAccess(id, userId);

    await this._songService.getSongById(songId);

    await this._service.addSongToPlaylist(id, songId);

    return created(h, {
      message: 'Successfully added song to playlist',
    });
  }

  async getSongsHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id } = request.params;

    await this._verifyPlaylistAccess(id, userId);

    const result = await this._service.getPlaylistSongs(id);

    return succeed(h, {
      data: {
        playlist: result,
      },
    });
  }

  async deleteSongsHandler(request, h) {
    this._validator.validateDeleteSongPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._verifyPlaylistAccess(id, userId);
    await this._service.deleteSongFromPlaylist(id, songId);

    return succeed(h, {
      message: 'Successfully deleted song from playlist',
    });
  }

  async _verifyPlaylistAccess(playlistId, userId) {
    try {
      await this._service.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof AuthorizationError) {
        try {
          await this._collaborationService.verifyCollaboration({ playlistId, userId });
        } catch (collabError) {
          if (collabError instanceof ClientError) {
            throw error;
          }

          throw collabError;
        }
      }
    }
  }
}

module.exports = { PlaylistHandler };
