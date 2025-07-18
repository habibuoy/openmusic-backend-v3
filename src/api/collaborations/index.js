const { CollaborationHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.1.0',
  register: async (server, {
    collaborationService,
    playlistService,
    userService,
    collaborationValidator,
    cacheService,
  }) => {
    const collaborationHandler = new CollaborationHandler(
      collaborationService,
      playlistService,
      userService,
      collaborationValidator,
      cacheService,
    );
    const collaborationRoutes = routes(collaborationHandler);

    server.route(collaborationRoutes);
  },
};
