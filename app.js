const
  express = require('express'),
  models = require('./models'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MySQLStore = require('express-mysql-session')(session),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Passport = require('./components').Passport,
  cors = require('cors'),
  log = require('./winston'),
  config = require('config'),
  router = express.Router(),
  app = express(),
  routes = require('./routes'),
  accessValidator = require('./components').RBAC,
  cluster = require('cluster'),
  http = require('http'),
  numCPUs = require('os').cpus().length

require('./components/common/prototype') // 原型注册
/* global vars */
global._ = require('lodash')
global.$ = Object.assign(require('./components').Common.Basic, require('./components').Common.Util)
// session 配置
let MySQLOptions = {
  host: config.mysql.options.host,
  port: config.mysql.options.port,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database
}

let sessionStore = new MySQLStore(MySQLOptions)

// cors 配置
let whiteList = [
  'http://localhost:5201',
  'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop',
  'http://ec2-34-213-223-46.us-west-2.compute.amazonaws.com',
  'http://127.0.0.1:5203',
  undefined]
let corsOpts = {
  origin: (origin, cb) => whiteList.includes(origin) ?
    cb(null, true) :
    cb(new Error('not allowed by CORS')),
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(corsOpts))
app.use(session({
  secret: 'loncus2017',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/', router)

// passport 配置
passport.use(new LocalStrategy({passReqToCallback: true}, Passport.login))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(Passport.find)

// 连接数据库
models.sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully')
    accessValidator.buildRbacArgs(rbac => routes(router, passport, rbac))
  })
  .catch(err => console.log('Unable to connect to the database:', err))

if (!config.cluster) {
  http.createServer(app).listen(config.port, () => log.info(`FBI warning: App listening at port: ${config.port}`))
} else {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
      log.warn(`worker ${worker.process.pid} died, 立刻重启`)
    })
  } else {
    http.createServer(app).listen(config.port, () => log.info(`FBI warning: App listening at port: ${config.port}`))
  }
}

module.exports = app
