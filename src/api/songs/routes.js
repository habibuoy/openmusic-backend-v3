const BasePath = '/songs';
const BasePathWithIdParam = `${BasePath}/{id}`;

const routes = (handlers) => [
  {
    method: 'POST',
    path: BasePath,
    handler: (request, h) => handlers.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: BasePath,
    handler: (request, h) => handlers.getSongsHandler(request, h),
  },
  {
    method: 'GET',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.getSongByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.putSongByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: BasePathWithIdParam,
    handler: (request, h) => handlers.deleteSongByIdHandler(request, h),
  },
];

module.exports = { routes };
