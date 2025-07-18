const { UploadHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, albumService, uploadValidator }) => {
    const uploadHandler = new UploadHandler(storageService, albumService, uploadValidator);
    const uploadRoutes = routes(uploadHandler);

    server.route(uploadRoutes);
  },
};
