/* eslint-disable import/order */

// General
const { AppConfig } = require('./shareds/AppConfig');
const path = require('path');

// Frameworks
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// Application, and Presentation
const { ClientError } = require('./errors/ClientError');
const { failed, systemFailed } = require('./api/responseObject');

// Album
const { AlbumService } = require('./services/postgres/AlbumService');
const { AlbumValidator } = require('./validators/album/index');
const albumPlugin = require('./api/albums/index');

// Song
const { SongService } = require('./services/postgres/SongService');
const { SongValidator } = require('./validators/song/index');
const songPlugin = require('./api/songs/index');

// User
const { UserService } = require('./services/postgres/UserService');
const { UserValidator } = require('./validators/user');
const userPlugin = require('./api/users');

// Auth
const { AuthenticationService } = require('./services/postgres/AuthenticationService');
const { AuthenticationValidator } = require('./validators/authentication');
const authPlugin = require('./api/authentications');
const { TokenManager } = require('./tokenizer/TokenManager');
const AuthConstants = require('./auth');

// Playlist
const { PlaylistService } = require('./services/postgres/PlaylistService');
const { PlaylistValidator } = require('./validators/playlist');
const playlistPlugin = require('./api/playlists');

// Collaboration
const { CollaborationService } = require('./services/postgres/CollaborationService');
const { CollaborationValidator } = require('./validators/collaboration');
const collaborationPlugin = require('./api/collaborations');

// Export
const { ProducerService } = require('./services/rabbitmq/ProducerService');
const { ExportValidator } = require('./validators/export');
const exportPlugin = require('./api/exports');

// Upload
const { LocalStorageService } = require('./services/storage/LocalStorageService');
const { UploadValidator } = require('./validators/upload');
const uploadPlugin = require('./api/uploads');

// Like
const { LikeService } = require('./services/postgres/LikeService');
const likePlugin = require('./api/likes');

// Cache
const { CacheService } = require('./services/cache/CacheService');

const AlbumCoversUploadDirectory = path.resolve(__dirname, 'api/uploads/files/albums/covers');

async function init() {
  const server = Hapi.server({
    port: AppConfig.server.Port,
    host: AppConfig.server.Host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy(AuthConstants.JwtAuthStrategyName, AuthConstants.JwtAuthScheme, {
    keys: AppConfig.auth.Jwt.AccessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: AppConfig.auth.Jwt.TokenAge,
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

  const playlistService = new PlaylistService();
  const collaborationService = new CollaborationService();
  await server.register({
    plugin: playlistPlugin,
    options: {
      playlistService,
      songService,
      collaborationService,
      playlistValidator: PlaylistValidator,
    },
  });

  await server.register({
    plugin: collaborationPlugin,
    options: {
      collaborationService,
      playlistService,
      userService,
      collaborationValidator: CollaborationValidator,
    },
  });

  await server.register({
    plugin: exportPlugin,
    options: {
      producerService: ProducerService,
      playlistService,
      exportValidator: ExportValidator,
    },
  });

  const storageService = new LocalStorageService(AlbumCoversUploadDirectory);

  await server.register({
    plugin: uploadPlugin,
    options: {
      storageService,
      albumService,
      uploadValidator: UploadValidator,
    },
  });

  const likeService = new LikeService();
  const cacheService = new CacheService();

  await server.register({
    plugin: likePlugin,
    options: {
      likeService,
      userService,
      albumService,
      cacheService,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
