module.exports = {
  port: 5202,
  serverPort: 5203,
  cluster: false,
  cache: false,
  mysql: {
    database: 'charlesdb',
    username: 'root',
    password: 'daohao4bb',
    options: {
      host: 'charlesdb.czexiowmvr7d.us-west-2.rds.amazonaws.com',
      port: '3306',
      dialect: 'mysql'
    }
  },
}

