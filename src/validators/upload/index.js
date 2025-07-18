const SchemaValidator = require('../SchemaValidator');
const { AlbumImageHeaderSchema } = require('./schema');

const UploadValidator = {
  validateAlbumImageHeaders: (headers) => SchemaValidator({
    schema: AlbumImageHeaderSchema, obj: headers,
  }),
};

module.exports = { UploadValidator };
