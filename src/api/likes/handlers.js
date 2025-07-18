const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');

class LikeHandler {
  constructor(likeService, userService, albumService, cacheService) {
    this._likeService = likeService;
    this._userService = userService;
    this._albumService = albumService;
    this._cacheService = cacheService;

    this._albumLikesCachePrefix = 'albumLikes';

    autoBind(this);
  }

  async postLikesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userService.verifyUserExists(userId);

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.addLike(userId, albumId);

    await this._cacheService.delete(`${this._albumLikesCachePrefix}:${albumId}`);

    return created(h, {
      message: 'Successfully liked album',
    });
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.verifyAlbumExists(albumId);

    let result;
    let cached = false;

    try {
      result = JSON.parse(await this._cacheService.get(`${this._albumLikesCachePrefix}:${albumId}`));
      cached = true;
    } catch (error) {
      result = await this._likeService.getLikesCount(albumId);
      await this._cacheService.set(`${this._albumLikesCachePrefix}:${albumId}`, JSON.stringify(result));
    }

    const response = succeed(h, {
      data: {
        likes: result,
      },
    });

    if (cached) {
      response
        .header('X-DATA-SOURCE', 'cache');
    }

    return response;
  }

  async deleteLikesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userService.verifyUserExists(userId);

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.deleteLike(userId, albumId);

    await this._cacheService.delete(`${this._albumLikesCachePrefix}:${albumId}`);

    return succeed(h, {
      message: 'Successfully deleted album',
    });
  }
}

module.exports = { LikeHandler };
