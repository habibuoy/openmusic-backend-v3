const SchemaValidator = require('../SchemaValidator');
const { SongPayloadSchema, SongQuerySchema } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => SchemaValidator({ schema: SongPayloadSchema, obj: payload }),
  validateSongQuery: (payload) => SchemaValidator({ schema: SongQuerySchema, obj: payload }),
};

module.exports = { SongValidator };
