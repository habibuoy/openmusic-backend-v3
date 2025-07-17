const autoBind = require('auto-bind');
const { succeed, created } = require('../responseObject');

class SongHandler {
  constructor(songService, songValidator) {
    this._service = songService;
    this._validator = songValidator;

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

    const result = await this._service.getSongById(id);

    return succeed(h, { data: { song: result } });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    const result = await this._service.updateSongById(id, request.payload);

    return succeed(h, {
      message: `Successfully updated song with id ${result}`,
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.deleteSongById(id);

    return succeed(h, {
      message: `Successfully deleted song with id ${result}`,
    });
  }
}

module.exports = { SongHandler };
