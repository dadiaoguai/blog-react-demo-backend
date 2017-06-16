const args = require('./appconfig/args'),
  errors = require('./appconfig/errors');

module.exports = {
  mysql: {
    database: 'loncus_test',
    username: 'root',
    password: '123456',
    options: {
      host: 'localhost',
      port: '3306',
      dialect: 'mysql'
    }
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  cache: false,
  port: 3000,
  args,
  errors,
  cluster: false,
  basis: {}
};
