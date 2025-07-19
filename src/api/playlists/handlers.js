const autoBind = require('auto-bind');
const { AuthorizationError } = require('../../errors/AuthorizationError');
const { ClientError } = require('../../errors/ClientError');
const { NotFoundError } = require('../../errors/NotFoundError');
const PlaylistActivityActionType = require('../../services/PlaylistActivityActionType');
const { succeed, created } = require('../responseObject');
const {
  PlaylistCachePrefix,
  PlaylistSongsCachePrefix,
  PlaylistActivitiesCachePrefix,
} = require('../CacheConstants');

class PlaylistHandler {
  constructor(
    playlistService,
    songService,
    collaborationService,
    playlistValidator,
    cacheService,
  ) {
    this._service = playlistService;
    this._songService = songService;
    this._collaborationService = collaborationService;
    this._validator = playlistValidator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { name } = request.payload;

    const result = await this._service.addPlaylist({ name, ownerId: userId });

    await this._deletePlaylistCache(userId);

    return created(h, {
      data: {
        playlistId: result,
      },
    });
  }

  async getPlaylistsHandler(request, h) {
    const { userId } = request.auth.credentials;

    const cacheKey = `${PlaylistCachePrefix}${userId}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._service.getPlaylists(userId)),
    );

    return succeed(h, {
      data: {
        playlists: JSON.parse(result),
      },
    }, { fromCache });
  }

  async deletePlaylistsHandler(request, h) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, userId);

    const result = await this._service.deletePlaylist(id);

    await this._deletePlaylistCache(userId, result);

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

    await this._service.addPlaylistActivity({
      playlistId: id,
      songId,
      userId,
      action: PlaylistActivityActionType.ADD,
    });

    await this._deletePlaylistSongsCache(id);

    return created(h, {
      message: 'Successfully added song to playlist',
    });
  }

  async getSongsHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id } = request.params;

    await this._verifyPlaylistAccess(id, userId);

    const cacheKey = `${PlaylistSongsCachePrefix}${id}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._service.getPlaylistSongs(id)),
    );

    return succeed(h, {
      data: {
        playlist: JSON.parse(result),
      },
    }, { fromCache });
  }

  async deleteSongsHandler(request, h) {
    this._validator.validateDeleteSongPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._verifyPlaylistAccess(id, userId);

    await this._service.deleteSongFromPlaylist(id, songId);

    await this._service.addPlaylistActivity({
      playlistId: id,
      songId,
      userId,
      action: PlaylistActivityActionType.DLT,
    });

    await this._deletePlaylistSongsCache(id);

    return succeed(h, {
      message: 'Successfully deleted song from playlist',
    });
  }

  async getActivitiesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._verifyPlaylistAccess(playlistId, userId);

    const cacheKey = `${PlaylistActivitiesCachePrefix}${playlistId}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._service.getActivities(playlistId)),
    );

    return succeed(h, {
      data: JSON.parse(result),
    }, { fromCache });
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

  async _deletePlaylistCache(userId, playlistId = undefined) {
    await this._cacheService.delete(`${PlaylistCachePrefix}${userId}`);
    if (playlistId) {
      await this._deletePlaylistActivitiesCache(playlistId);
    }
  }

  async _deletePlaylistSongsCache(playlistId) {
    await this._cacheService.delete(`${PlaylistSongsCachePrefix}${playlistId}`);
    await this._deletePlaylistActivitiesCache(playlistId);
  }

  async _deletePlaylistActivitiesCache(playlistId) {
    await this._cacheService.delete(`${PlaylistActivitiesCachePrefix}${playlistId}`);
  }
}

module.exports = { PlaylistHandler };
