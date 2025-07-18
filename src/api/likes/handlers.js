const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');

class LikeHandler {
  constructor(likeService, userService, albumService) {
    this._likeService = likeService;
    this._userService = userService;
    this._albumService = albumService;

    autoBind(this);
  }

  async postLikesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userService.verifyUserExists(userId);

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.addLike(userId, albumId);

    return created(h, {
      message: 'Successfully liked album',
    });
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.verifyAlbumExists(albumId);

    const result = await this._likeService.getLikesCount(albumId);

    return succeed(h, {
      data: {
        likes: result,
      },
    });
  }

  async deleteLikesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userService.verifyUserExists(userId);

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.deleteLike(userId, albumId);

    return succeed(h, {
      message: 'Successfully deleted album',
    });
  }
}

module.exports = { LikeHandler };
