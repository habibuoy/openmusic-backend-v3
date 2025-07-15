const BasePath = '/users';

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handler.postUserHandler(request, h),
  },
];

module.exports = { routes };
