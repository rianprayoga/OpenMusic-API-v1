const AuditHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'audit',
  version: '1.0.0',
  register: async (server, {
    playlistService, authorizationService, service,
  }) => {
    const handler = new AuditHandler(playlistService, authorizationService, service);
    server.route(routes(handler));
  },
};
