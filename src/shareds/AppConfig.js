require('dotenv').config();

const { env } = process;

const AppConfig = {
  server: {
    Host: env.HOST,
    Port: env.PORT,
  },
  auth: {
    Jwt: {
      AccessTokenKey: env.ACCESS_TOKEN_KEY,
      RefreshTokenKey: env.REFRESH_TOKEN_KEY,
      TokenAge: env.ACCESS_TOKEN_AGE,
    },
  },
  rabbitmq: {
    Server: env.RABBITMQ_SERVER,
  },
};

module.exports = { AppConfig };
