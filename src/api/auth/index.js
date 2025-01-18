const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async (server, {
    userService, authService, tokenManager, validator,
  }) => {
    const handler = new AuthHandler(userService, authService, tokenManager, validator);
    server.route(routes(handler));
  },
};
