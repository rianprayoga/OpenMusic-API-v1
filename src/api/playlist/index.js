const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistService, songService, validator }) => {
    const handler = new PlaylistHandler(playlistService, songService, validator);
    server.route(routes(handler));
  },
};
