const { PlaylistHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistService, songService, playlistValidator }) => {
    const playlistHandler = new PlaylistHandler(playlistService, songService, playlistValidator);
    const playlistRoutes = routes(playlistHandler);

    server.route(playlistRoutes);
  },
};
