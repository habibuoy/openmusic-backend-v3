const SchemaValidator = require('../SchemaValidator');
const { UserPayloadSchema } = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => SchemaValidator({
    schema: UserPayloadSchema,
    obj: payload,
  }),
};

module.exports = { UserValidator };
