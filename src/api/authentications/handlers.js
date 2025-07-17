const autoBind = require('auto-bind');
const { created, succeed } = require('../responseObject');

class AuthenticationHandler {
  constructor(authService, userService, validator, tokenManager) {
    this._service = authService;
    this._userService = userService;
    this._validator = validator;
    this._tokenManager = tokenManager;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    await this._validator.validatePostPayload(request.payload);

    const { username, password } = request.payload;

    const userId = await this._userService.verifyUserCredentials(username, password);

    const payload = { userId };
    const accessToken = this._tokenManager.generateAccessToken(payload);
    const refreshToken = this._tokenManager.generateRefreshToken(payload);

    await this._service.addRefreshToken(refreshToken);

    return created(h, {
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  async putAuthenticationHandler(request, h) {
    await this._validator.validatePutPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._service.verifyRefreshToken(refreshToken);

    const payload = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken(payload);

    return succeed(h, {
      data: {
        accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(request, h) {
    await this._validator.validateDeletePayload(request.payload);

    const { refreshToken } = request.payload;

    await this._service.verifyRefreshToken(refreshToken);
    await this._service.deleteRefreshToken(refreshToken);

    return succeed(h, {
      message: 'Successfully deleted authentication',
    });
  }
}

module.exports = { AuthenticationHandler };
