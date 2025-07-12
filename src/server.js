require('dotenv').config();
const Hapi = require('@hapi/hapi');
const { ClientError } = require('./errors/ClientError');
const { AlbumService } = require('./services/postgres/AlbumService');
const { AlbumValidator } = require('./validators/album/index');
const albumPlugin = require('./api/albums/index');

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
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response instanceof Error) {
      console.error('Unexpected error has occured', response.stack);
      const newResponse = h.response({
        status: 'error',
        message: 'There was an error on our server while processing your request',
      });
      newResponse.code(500);
      return newResponse;
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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
