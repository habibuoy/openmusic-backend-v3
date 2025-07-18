const autoBind = require('auto-bind');
const { created } = require('../responseObject');

class ExportHandler {
  constructor(producerService, playlistService, exportValidator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = exportValidator;

    this._exportQueue = 'export:playlists';

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, userId);

    const { targetEmail } = request.payload;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(this._exportQueue, JSON.stringify(message));

    return created(h, {
      message: 'Your playlist is being exported',
    });
  }
}

module.exports = { ExportHandler };
