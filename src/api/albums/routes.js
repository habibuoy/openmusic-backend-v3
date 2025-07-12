const routes = (handlers) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handlers.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handlers.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handlers.putAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handlers.deleteAlbumByIdHandler(request, h),
  },
];

module.exports = { routes };
