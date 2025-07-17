const BasePath = '/users';

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postUserHandler,
  },
];

module.exports = { routes };
