const Jwt = require('@hapi/jwt');
const { InvariantError } = require('../errors/InvariantError');
const { AppConfig } = require('../shareds/AppConfig');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, AppConfig.auth.Jwt.AccessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(
    payload,
    AppConfig.auth.Jwt.RefreshTokenKey,
  ),
  verifyRefreshToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifyPayload(artifacts);

      const { payload } = artifacts.decoded;

      return payload;
    } catch (error) {
      throw new InvariantError('Invalid refresh token');
    }
  },
};

module.exports = { TokenManager };
