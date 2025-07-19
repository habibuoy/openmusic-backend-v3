const { PlaylistHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.1.0',
  register: async (server, {
    playlistService,
    songService,
    collaborationService,
    playlistValidator,
    cacheService,
  }) => {
    const playlistHandler = new PlaylistHandler(
      playlistService,
      songService,
      collaborationService,
      playlistValidator,
      cacheService,
    );
    const playlistRoutes = routes(playlistHandler);

    server.route(playlistRoutes);
  },
};
