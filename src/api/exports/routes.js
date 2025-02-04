const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (request, h) => handler.postExportPlaylistHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },

];

module.exports = routes;
