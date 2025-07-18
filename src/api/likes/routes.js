const { JwtAuthStrategyName } = require('../../auth');

const BasePath = '/albums';
const BasePathWithIdParam = `${BasePath}/{id}`;
const LikesPath = `${BasePathWithIdParam}/likes`;

const routes = (handler) => [
  {
    method: 'POST',
    path: LikesPath,
    handler: handler.postLikesHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
  {
    method: 'GET',
    path: LikesPath,
    handler: handler.getLikesHandler,
  },
  {
    method: 'DELETE',
    path: LikesPath,
    handler: handler.deleteLikesHandler,
    options: {
      auth: JwtAuthStrategyName,
    },
  },
];

module.exports = { routes };
