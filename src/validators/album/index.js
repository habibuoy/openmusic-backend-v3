const SchemaValidator = require('../SchemaValidator');
const { AlbumPayloadSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => SchemaValidator({ schema: AlbumPayloadSchema, obj: payload }),
};

module.exports = { AlbumValidator };
