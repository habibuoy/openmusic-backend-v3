const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/playlists';
const BaseWithIdParamPath = `${BasePath}/{id}`;
const SongsPath = `${BaseWithIdParamPath}/songs`;

const routes = (handlers) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handlers.postPlaylistsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: BasePath,
    handler: (request, h) => handlers.getPlaylistsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: BaseWithIdParamPath,
    handler: (request, h) => handlers.deletePlaylistsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'POST',
    path: SongsPath,
    handler: (request, h) => handlers.postSongsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: SongsPath,
    handler: (request, h) => handlers.getSongsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: SongsPath,
    handler: (request, h) => handlers.deleteSongsHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
