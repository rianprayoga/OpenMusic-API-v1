require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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
const AuthenticationService = require('./service/AuthenticationService');

const playlist = require('./api/playlist');
const PlaylistService = require('./service/PlaylistService');

const AuthorizationService = require('./service/AuthorizationService');

const audit = require('./api/audit');
const AuditService = require('./service/AuditService');

const collab = require('./api/collaborations');
const CollabsService = require('./service/CollabsService');

const init = async () => {
  const albumService = new AlbumsService(db);
  const songService = new SongsService(db);
  const userService = new UsersService(db);
  const authService = new AuthenticationService(db);
  const playlistService = new PlaylistService(db);
  const authorizationService = new AuthorizationService(db);
  const auditService = new AuditService(db);
  const collaborationService = new CollabsService(db);

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

  // external plugins
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // add auth strategy
  server.auth.strategy('client_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: collab,
      options: {
        collabsService: collaborationService,
        playlistService,
        authorizationService,
        userService,
        validator: Validator,
      },
    },
    {
      plugin: audit,
      options: {
        playlistService,
        authorizationService,
        service: auditService,
      },
    },
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
    {
      plugin: playlist,
      options: {
        playlistService,
        songService,
        authorService: authorizationService,
        auditService,
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
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
