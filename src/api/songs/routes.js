const BasePath = '/songs';
const BasePathWithIdParam = `${BasePath}/{id}`;

const routes = (handler) => [
  {
    method: 'POST',
    path: BasePath,
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: BasePath,
    handler: handler.getSongsHandler,
  },
  {
    method: 'GET',
    path: BasePathWithIdParam,
    handler: handler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: BasePathWithIdParam,
    handler: handler.putSongByIdHandler,
  },
  {
    method: 'DELETE',
    path: BasePathWithIdParam,
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = { routes };
