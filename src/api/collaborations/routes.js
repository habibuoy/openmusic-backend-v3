const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/collaborations';

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postCollaborationHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: BasePath,
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
