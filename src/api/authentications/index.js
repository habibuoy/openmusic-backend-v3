const { AuthenticationHandler } = require('./handlers');
const { routes } = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authService, userService, validator, tokenManager,
  }) => {
    const authHandler = new AuthenticationHandler(
      authService,
      userService,
      validator,
      tokenManager,
    );
    const authRoutes = routes(authHandler);

    server.route(authRoutes);
  },
};
