const SchemaValidator = require('../SchemaValidator');

const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');

const AuthenticationValidator = {
  validatePostPayload: (payload) => SchemaValidator({
    schema: PostAuthenticationPayloadSchema, obj: payload,
  }),
  validatePutPayload: (payload) => SchemaValidator({
    schema: PutAuthenticationPayloadSchema,
    obj: payload,
  }),
  validateDeletePayload: (payload) => SchemaValidator({
    schema: DeleteAuthenticationPayloadSchema,
    obj: payload,
  }),
};

module.exports = { AuthenticationValidator };
