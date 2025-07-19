const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');
const { AppConfig } = require('../../shareds/AppConfig');
const { AlbumCachePrefix } = require('../CacheConstants');

class UploadHandler {
  constructor(storageService, albumService, uploadValidator, cacheService) {
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = uploadValidator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postAlbumCoversHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateAlbumImageHeaders(cover.hapi.headers);

    const { id } = request.params;

    await this._albumService.verifyAlbumExists(id);

    cover.hapi.albumId = id;

    const basePathLocation = `http://${AppConfig.server.Host}:${AppConfig.server.Port}/albums/covers`;
    const urlPath = await this._storageService.writeAlbumCoverFile({
      readStream: cover,
      meta: cover.hapi,
      basePathLocation,
    });

    await this._albumService.addAlbumCover(id, urlPath);

    await this._cacheService.delete(`${AlbumCachePrefix}${id}`);

    return created(h, {
      message: 'Successfully uploaded album cover',
    });
  }
}

module.exports = { UploadHandler };
