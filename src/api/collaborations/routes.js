const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/collaborations';

const routes = (handlers) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handlers.postCollaborationHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'DELETE',
    path: BasePath,
    handler: (request, h) => handlers.deleteCollaborationHandler(request, h),
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
