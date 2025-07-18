const { LikeHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { likeService, userService, albumService }) => {
    const likeHandler = new LikeHandler(likeService, userService, albumService);
    const likeRoutes = routes(likeHandler);

    server.route(likeRoutes);
  },
};
