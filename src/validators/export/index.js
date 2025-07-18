const SchemaValidator = require('../SchemaValidator');
const { ExportPlaylistSchema } = require('./schema');

const ExportValidator = {
  validateExportPlaylistPayload: (payload) => SchemaValidator({
    schema: ExportPlaylistSchema,
    obj: payload,
  }),
};

module.exports = { ExportValidator };
