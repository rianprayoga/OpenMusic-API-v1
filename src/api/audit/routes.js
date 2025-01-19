const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivitiesHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
];

module.exports = routes;
