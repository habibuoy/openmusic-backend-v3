const autoBind = require('auto-bind');
const { created } = require('../responseObject');

class UserHandler {
  constructor(userService, validator) {
    this._service = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    await this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    return created(h, {
      data: {
        userId,
      },
    });
  }
}

module.exports = { UserHandler };
