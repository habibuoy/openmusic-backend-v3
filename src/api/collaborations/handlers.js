const autoBind = require('auto-bind');
const { succeed, created } = require('../responseObject');

class CollaborationHandler {
  constructor(
    collaborationService,
    playlistService,
    userService,
    collaborationValidator,
  ) {
    this._service = collaborationService;
    this._validator = collaborationValidator;
    this._playlistService = playlistService;
    this._userService = userService;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this._userService.getUser(userId);

    const result = await this._service.addCollaboration({ playlistId, userId });

    return created(h, {
      data: {
        collaborationId: result,
      },
    });
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeletePayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration({ playlistId, userId });

    return succeed(h, {
      message: 'Successfully deleted collaboration',
    });
  }
}

module.exports = { CollaborationHandler };
