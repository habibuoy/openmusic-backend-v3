require('dotenv').config();
const Hapi = require('@hapi/hapi');
const { ClientError } = require('./errors/ClientError');
const { AlbumService } = require('./services/postgres/AlbumService');
const { AlbumValidator } = require('./validators/album/index');
const albumPlugin = require('./api/albums/index');
const { SongService } = require('./services/postgres/SongService');
const { SongValidator } = require('./validators/song/index');
const songPlugin = require('./api/songs/index');
const { failed, systemFailed } = require('./api/responseObject');

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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
