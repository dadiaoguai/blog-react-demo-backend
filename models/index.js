const Sequelize = require('sequelize'),
  fs = require('fs'),
  config = require('config'),
  path = require('path'),
  association = require('./association');

const dbConfig = config.mysql;
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);
let db = {};

fs.readdirSync(__dirname, 'utf8')
  .filter(file => file.endsWith('.js') && file !== 'index.js' && file !== 'association.js').forEach(file => {
    sequelize.import(path.join(__dirname, file))
  });

let models = sequelize.models;

association(models);

db.models = models;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

