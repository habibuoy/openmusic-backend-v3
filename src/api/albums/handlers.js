const { created, succeed } = require('../responseObject');

class AlbumHandler {
  constructor(albumService, albumValidator) {
    this._service = albumService;
    this._validator = albumValidator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const result = await this._service.addAlbum({ name, year });

    return created(h, { data: { albumId: result.id } });
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.getAlbumById(id);

    return succeed(h, { data: { album: result } });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    const result = await this._service.updateAlbumById(id, { name, year });

    return succeed(h, { message: `Successfully updated album with id ${result.id}` });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.deleteAlbumById(id);

    return succeed(h, { message: `Succesfully deleted album with id ${result.id}` });
  }
}

module.exports = { AlbumHandler };
