const BasePath = '/albums';
const BasePathWithIdParam = `${BasePath}/{id}`;

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: BasePathWithIdParam,
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: BasePathWithIdParam,
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: BasePathWithIdParam,
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = { routes };
