require('dotenv').config();

const Hapi = require('@hapi/hapi');

const Validator = require('./validator');
const ClientError = require('./exceptions/ClientError');
const db = require('./db');

const albums = require('./api/albums');
const AlbumsService = require('./service/AlbumsService');

const SongsService = require('./service/SongsService');
const songs = require('./api/songs');

const UsersService = require('./service/UsersService');
const users = require('./api/users');

const tokenManager = require('./tokenize/TokenManager');
const auth = require('./api/auth');
const AuthService = require('./service/AuthService');

const init = async () => {
  const albumService = new AlbumsService(db);
  const songService = new SongsService(db);
  const userService = new UsersService(db);
  const authService = new AuthService(db);

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

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: Validator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: Validator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: Validator,
      },
    },
    {
      plugin: auth,
      options: {
        userService,
        authService,
        tokenManager,
        validator: Validator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
