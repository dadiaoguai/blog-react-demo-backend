const Sequelize = require('sequelize');

module.exports = sequelize => {
  sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {type: Sequelize.STRING},
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {freezeTableName: true});

  sequelize.define('permission', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    operation: {
      type: Sequelize.STRING,
      allowNull: false
    },
    target: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {freezeTableName: true});

  sequelize.define('grant', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {type: Sequelize.STRING},
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {freezeTableName: true});

  sequelize.define('AccountRole', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  })
}
