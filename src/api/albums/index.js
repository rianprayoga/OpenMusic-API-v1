const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service,
    storageService,
    cacheService,
    likeService,
    validator,
  }) => {
    const handler = new AlbumHandler(
      service,
      storageService,
      cacheService,
      likeService,
      validator,
    );

    server.route(routes(handler));
  },
};
