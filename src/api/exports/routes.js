const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/export';
const PlaylistPath = `${BasePath}/playlists/{playlistId}`;

const routes = (handler) => [
  {
    method: 'POST',
    path: PlaylistPath,
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
