const path = require('path');

const BasePath = '/albums';
const BasePathWithIdParam = `${BasePath}/{id}`;
const UploadCoverPath = `${BasePathWithIdParam}/covers`;
const AlbumCoversPath = `${BasePath}/covers/{param*}`;

const routes = (handler) => [
  {
    method: 'POST',
    path: UploadCoverPath,
    handler: handler.postAlbumCoversHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: AlbumCoversPath,
    handler: {
      directory: {
        path: path.resolve(__dirname, 'files/albums/'),
      },
    },
  },
];

module.exports = { routes };
