const Common = require('./common'),
  ApiDialect = require('./api-dialect'),
  Model = require('./models'),
  Passport = require('./passport'),
  RBAC = require('./rbac'),
  Widgets = require('./widgets'),
  config = require('config');

module.exports = {
  Common,
  ApiDialect,
  Cache: config.cache ? require('./cache') : null,
  Model,
  Passport,
  RBAC,
  Widgets
}
