const SchemaValidator = require('../SchemaValidator');
const {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
} = require('./schema');

const CollaborationValidator = {
  validatePostPayload: (payload) => SchemaValidator({
    schema: PostCollaborationPayloadSchema, obj: payload,
  }),
  validateDeletePayload: (payload) => SchemaValidator({
    schema: DeleteCollaborationPayloadSchema,
    obj: payload,
  }),
};

module.exports = { CollaborationValidator };
