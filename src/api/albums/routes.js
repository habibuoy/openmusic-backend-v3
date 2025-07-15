const BasePath = '/albums';
const BasePathWithIdParam = `${BasePath}/{id}`;

const routes = (handlers) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handlers.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.putAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.deleteAlbumByIdHandler(request, h),
  },
];

module.exports = { routes };
