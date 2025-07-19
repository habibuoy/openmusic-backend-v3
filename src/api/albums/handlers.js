const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');
const { AlbumCachePrefix } = require('../CacheConstants');

class AlbumHandler {
  constructor(albumService, albumValidator, cacheService) {
    this._service = albumService;
    this._validator = albumValidator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const result = await this._service.addAlbum({ name, year });

    return created(h, { data: { albumId: result.id } });
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const cacheKey = `${AlbumCachePrefix}${id}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._service.getAlbumById(id)),
    );

    return succeed(h, {
      data: {
        album: JSON.parse(result),
      },
    }, { fromCache });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    const result = await this._service.updateAlbumById(id, { name, year });
    await this._deleteAlbumCache(id);

    return succeed(h, { message: `Successfully updated album with id ${result.id}` });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.deleteAlbumById(id);
    await this._deleteAlbumCache(id);

    return succeed(h, { message: `Succesfully deleted album with id ${result.id}` });
  }

  async _deleteAlbumCache(albumId) {
    const cacheKey = `${AlbumCachePrefix}${albumId}`;
    await this._cacheService.delete(cacheKey);
  }
}

module.exports = { AlbumHandler };
