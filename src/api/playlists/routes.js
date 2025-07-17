const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/playlists';
const BaseWithIdParamPath = `${BasePath}/{id}`;
const SongsPath = `${BaseWithIdParamPath}/songs`;
const ActivitiesPath = `${BaseWithIdParamPath}/activities`;

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postPlaylistsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: BasePath,
    handler: handler.getPlaylistsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: BaseWithIdParamPath,
    handler: handler.deletePlaylistsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'POST',
    path: SongsPath,
    handler: handler.postSongsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: SongsPath,
    handler: handler.getSongsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: SongsPath,
    handler: handler.deleteSongsHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: ActivitiesPath,
    handler: handler.getActivitiesHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
