const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {
    playlistService, songService, authorService, auditService, validator,
  }) => {
    const handler = new PlaylistHandler(
      playlistService,
      songService,
      authorService,
      auditService,
      validator,
    );
    server.route(routes(handler));
  },
};
