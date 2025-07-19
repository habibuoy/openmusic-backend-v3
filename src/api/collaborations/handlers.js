const autoBind = require('auto-bind');
const { succeed, created } = require('../responseObject');
const { PlaylistCachePrefix } = require('../CacheConstants');

class CollaborationHandler {
  constructor(
    collaborationService,
    playlistService,
    userService,
    collaborationValidator,
    cacheService,
  ) {
    this._service = collaborationService;
    this._validator = collaborationValidator;
    this._playlistService = playlistService;
    this._userService = userService;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this._userService.verifyUserExists(userId);

    const result = await this._service.addCollaboration({ playlistId, userId });

    await this._deletePlaylistCache(playlistId);

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

    await this._deletePlaylistCache(userId);

    return succeed(h, {
      message: 'Successfully deleted collaboration',
    });
  }

  async _deletePlaylistCache(playlistId) {
    const cacheKey = `${PlaylistCachePrefix}${playlistId}`;
    await this._cacheService.delete(cacheKey);
  }
}

module.exports = { CollaborationHandler };
