const ExportPlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, {
    playlistService, authorizationService, producerServices, validator,
  }) => {
    const handler = new ExportPlaylistHandler(
      playlistService,
      authorizationService,
      producerServices,
      validator,
    );
    server.route(routes(handler));
  },
};
