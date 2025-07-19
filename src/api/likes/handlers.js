const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');
const { AlbumLikesCachePrefix } = require('../CacheConstants');

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

    await this._cacheService.delete(`${AlbumLikesCachePrefix}:${albumId}`);

    return created(h, {
      message: 'Successfully liked album',
    });
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.verifyAlbumExists(albumId);

    const cacheKey = `${AlbumLikesCachePrefix}:${albumId}`;

    const { result, fromCache } = await this._cacheService.getOrCreate(
      cacheKey,
      async () => JSON.stringify(await this._likeService.getLikesCount(albumId)),
    );

    return succeed(h, {
      data: {
        likes: JSON.parse(result),
      },
    }, { fromCache });
  }

  async deleteLikesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userService.verifyUserExists(userId);

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.deleteLike(userId, albumId);

    await this._cacheService.delete(`${AlbumLikesCachePrefix}:${albumId}`);

    return succeed(h, {
      message: 'Successfully deleted album',
    });
  }
}

module.exports = { LikeHandler };
