const CollabsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collabs',
  version: '1.0.0',
  register: async (server, {
    collabsService,
    playlistService,
    authorizationService,
    userService,
    validator,
  }) => {
    const handler = new CollabsHandler(
      collabsService,
      playlistService,
      authorizationService,
      userService,
      validator,
    );
    server.route(routes(handler));
  },
};
