const autoBind = require('auto-bind');
const { succeed, created } = require('../responseObject');
const { UserCachePrefix } = require('../CacheConstants');

class SongHandler {
  constructor(songService, playlistService, songValidator, cacheService) {
    this._service = songService;
    this._playlistService = playlistService;
    this._validator = songValidator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const result = await this._service.addSong(request.payload);

    return created(h, { data: { songId: result.id } });
  }

  async getSongsHandler(request, h) {
    this._validator.validateSongQuery(request.query);

    const result = await this._service.getSongs(request.query);

    const songs = result.map((s) => ({
      id: s.id, title: s.title, performer: s.performer,
    }));
    return succeed(h, { data: { songs } });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const cacheKey = `${UserCachePrefix}${id}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._service.getSongById(id)),
    );

    return succeed(h, {
      data: {
        song: JSON.parse(result),
      },
    }, { fromCache });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    const result = await this._service.updateSongById(id, request.payload);

    await this._deleteSongCache(id);

    return succeed(h, {
      message: `Successfully updated song with id ${result}`,
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.deleteSongById(id);

    const playlistsResult = await this._playlistService.deleteSongFromPlaylists(id);

    await this._deleteSongCache(id);

    if (playlistsResult.length > 0) {
      await Promise.all(playlistsResult.map((p) => this._cacheService.delete(p.id)));
    }

    return succeed(h, {
      message: `Successfully deleted song with id ${result}`,
    });
  }

  async _deleteSongCache(id) {
    await this._cacheService.delete(`${UserCachePrefix}${id}`);
  }
}

module.exports = { SongHandler };
