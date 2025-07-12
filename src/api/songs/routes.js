const routes = (handlers) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handlers.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handlers.getSongsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handlers.getSongByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handlers.putSongByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handlers.deleteSongByIdHandler(request, h),
  },
];

module.exports = { routes };
