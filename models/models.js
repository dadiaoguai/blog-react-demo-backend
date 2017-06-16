const Sequelize = require('sequelize');

const usernameMaxLength = 50;

module.exports = sequelize => {
  sequelize.define('account', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
      type: Sequelize.STRING(usernameMaxLength),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {freezeTableName: true});

  sequelize.define('article', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    title: {type: Sequelize.STRING},
    content: {type: Sequelize.TEXT},
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {freezeTableName: true});

  sequelize.define('tag', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {type: Sequelize.STRING, allowNull: false},
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {
    freezeTableName: true
  });

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
  });

  sequelize.define('ArticleTag', {
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
  });
};
