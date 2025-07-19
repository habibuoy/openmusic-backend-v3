const { SongHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, {
    songService, playlistService, songValidator, cacheService,
  }) => {
    const songHandler = new SongHandler(songService, playlistService, songValidator, cacheService);
    const songRoutes = routes(songHandler);

    server.route(songRoutes);
  },
};
