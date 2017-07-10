const models = require('../../models').models

// exports.login = (req, username, password, done) => {
//   models.account.findOne({
//     where: {
//       username,
//       status: cfg.status.normal
//     }
//   }).then(obj => {
//     if (!obj) {
//       return done(null, false, '无效的账号')
//     }
//     let computedPassword = common.computedPassword(String(password))
//
//     if (obj.password !== computedPassword) {
//       return done(null, false, '密码错误')
//     }
//
//     return done(null, obj)
//   })
//     .catch(err => done(err))
// }

exports.login = (req, username, password = '', done) => {

  models.account.findOne({
    where: {
      id: username,
      status: 1
    },
    include: [
      {
        model: models.role,
        attributes: ['id'],
        through: {
          attributes: [],
          where: {status: 1}
        },
        required: false
      }
    ]
  }).then(obj => {
    if (!obj) {
      return done(null, false, '无效的账号')
    }
    return done(null, obj)
  })
    .catch(err => done(err))
}

exports.find = (id, done) => {
  models.account.findOne({
    where: {id},
    include: [
      {
        model: models.role,
        where: {status: 1},
        through: {attributes: []},
        required: false
      }
    ]
  })
    .then(obj => done(null, obj))
    .catch(err => done(err))
}

exports.isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.json({
  msg: '请先登录',
  status: 'failed'
})
