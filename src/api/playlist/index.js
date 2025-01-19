const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {
    playlistService, songService, authorService, validator,
  }) => {
    const handler = new PlaylistHandler(playlistService, songService, authorService, validator);
    server.route(routes(handler));
  },
};
