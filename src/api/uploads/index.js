const { UploadHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.1.0',
  register: async (server, {
    storageService,
    albumService,
    uploadValidator,
    cacheService,
  }) => {
    const uploadHandler = new UploadHandler(
      storageService,
      albumService,
      uploadValidator,
      cacheService,
    );
    const uploadRoutes = routes(uploadHandler);

    server.route(uploadRoutes);
  },
};
