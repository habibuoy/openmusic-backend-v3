const BasePath = '/authentications';

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: BasePath,
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: BasePath,
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = { routes };
