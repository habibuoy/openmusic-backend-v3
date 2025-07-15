const SchemaValidator = require('../SchemaValidator');

const {
  PlaylistPayloadSchema,
  PostSongPayloadSchema,
  DeleteSongPayloadSchema,
} = require('./schema');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => SchemaValidator({
    schema: PlaylistPayloadSchema,
    obj: payload,
  }),
  validatePostSongPayload: (payload) => SchemaValidator({
    schema: PostSongPayloadSchema,
    obj: payload,
  }),
  validateDeleteSongPayload: (payload) => SchemaValidator({
    schema: DeleteSongPayloadSchema,
    obj: payload,
  }),
};

module.exports = { PlaylistValidator };
