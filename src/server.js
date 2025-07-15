require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { ClientError } = require('./errors/ClientError');
const { AlbumService } = require('./services/postgres/AlbumService');
const { AlbumValidator } = require('./validators/album/index');
const albumPlugin = require('./api/albums/index');
const { SongService } = require('./services/postgres/SongService');
const { SongValidator } = require('./validators/song/index');
const songPlugin = require('./api/songs/index');
const { failed, systemFailed } = require('./api/responseObject');
const { UserService } = require('./services/postgres/UserService');
const { UserValidator } = require('./validators/user');
const userPlugin = require('./api/users');
const { AuthenticationService } = require('./services/postgres/AuthenticationService');
const { AuthenticationValidator } = require('./validators/authentication');
const authPlugin = require('./api/authentications');
const { TokenManager } = require('./tokenizer/TokenManager');
const AuthConstants = require('./auth');

async function init() {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: Jwt,
  });

  server.auth.strategy(AuthConstants.JwtAuthStrategyName, AuthConstants.JwtAuthScheme, {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { userId: artifacts.decoded.payload.userId },
    }),
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return failed(h, {
        statusCode: response.statusCode,
        message: response.message,
      });
    }

    if (response instanceof Error
        && response.output.statusCode >= 500
        && response.output.statusCode < 600
    ) {
      console.error('Unexpected error has occured', response.stack);
      return systemFailed(h, {
        message: 'There was an error on our server while processing your request',
      });
    }

    return h.continue;
  });

  const albumService = new AlbumService();
  await server.register({
    plugin: albumPlugin,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  const songService = new SongService();
  await server.register({
    plugin: songPlugin,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  const userService = new UserService();
  await server.register({
    plugin: userPlugin,
    options: {
      userService,
      validator: UserValidator,
    },
  });

  const authService = new AuthenticationService();
  await server.register({
    plugin: authPlugin,
    options: {
      authService,
      userService,
      validator: AuthenticationValidator,
      tokenManager: TokenManager,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
