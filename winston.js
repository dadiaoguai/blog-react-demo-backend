const winston = require('winston'),
  fs = require('fs'),
  moment = require('moment'),
  env = process.env.NODE_ENV || 'dev',
  logDir = 'log';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

let todayDir = `${logDir}/${moment().format('YYYY-MM-DD')}`

if (!fs.existsSync(todayDir)) {
  fs.mkdirSync(todayDir)
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp () {
        return moment().format('YYYY/MM/DD HH:mm:ss')
      },
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'info-file',
      filename: `${todayDir}/infos.log`,
      prepend: true,
      localTime: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'error-file',
      filename: `${todayDir}/errors.log`,
      prepend: true,
      localTime: true,
      level: 'error'
    })
  ]
});

module.exports = logger;
