const BasePath = '/authentications';

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
  },
  {
    method: 'PUT',
    path: BasePath,
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
  },
  {
    method: 'DELETE',
    path: BasePath,
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
  },
];

module.exports = { routes };
