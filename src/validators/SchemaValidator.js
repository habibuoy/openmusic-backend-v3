const { ClientError } = require('../errors/ClientError');
const { InvariantError } = require('../errors/InvariantError');

const SchemaValidator = ({
  schema,
  obj,
  clientErrorFactory = undefined,
  onError = undefined,
}) => {
  const validationResult = schema.validate(obj);
  if (validationResult.error) {
    if (typeof onError === 'function') {
      onError(validationResult.error);
    }

    if (typeof clientErrorFactory === 'function') {
      const error = clientErrorFactory(validationResult.error);
      if (error instanceof ClientError) {
        throw error;
      }
    }

    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = SchemaValidator;
