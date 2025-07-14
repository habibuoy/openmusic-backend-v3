const { UserHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { userService, validator }) => {
    const userHandler = new UserHandler(userService, validator);
    const userRoutes = routes(userHandler);

    server.route(userRoutes);
  },
};
