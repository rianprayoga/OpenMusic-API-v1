const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postCreatePlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postAddSongToPlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getPlaylistDetailHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deleteSongsFromPlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
];

module.exports = routes;
