require('dotenv').config();

const AppConfig = {
  server: {
    Host: process.env.HOST,
    Port: process.env.PORT,
  },
  auth: {
    Jwt: {
      AccessTokenKey: process.env.ACCESS_TOKEN_KEY,
      RefreshTokenKey: process.env.REFRESH_TOKEN_KEY,
      TokenAge: process.env.ACCESS_TOKEN_AGE,
    },
  },
};

module.exports = { AppConfig };
