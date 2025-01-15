require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./service/AlbumsService');
const Validator = require('./validator');
const ClientError = require('./exceptions/ClientError');
const db = require('./db');

const init = async () => {
  const albumService = new AlbumsService(db);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: { request: ['error'] },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: Validator,
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

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
