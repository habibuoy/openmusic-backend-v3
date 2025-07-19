const { AlbumHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.1.0',
  register: async (server, { albumService, albumValidator, cacheService }) => {
    const albumHandler = new AlbumHandler(albumService, albumValidator, cacheService);
    const albumRoutes = routes(albumHandler);

    server.route(albumRoutes);
  },
};
