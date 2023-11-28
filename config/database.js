require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
