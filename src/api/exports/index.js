const ExportPlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, {
    authorizationService, producerServices, validator,
  }) => {
    const handler = new ExportPlaylistHandler(
      authorizationService,
      producerServices,
      validator,
    );
    server.route(routes(handler));
  },
};
