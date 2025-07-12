const { SongHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    const songRoutes = routes(songHandler);

    server.route(songRoutes);
  },
};
