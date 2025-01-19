const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollabsHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollabsHandler(request, h),
    options: {
      auth: 'client_jwt',
    },
  },
];

module.exports = routes;
