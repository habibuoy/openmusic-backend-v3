const { ExportHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistService, exportValidator }) => {
    const exportHandler = new ExportHandler(producerService, playlistService, exportValidator);
    const exportRoutes = routes(exportHandler);

    server.route(exportRoutes);
  },
};
