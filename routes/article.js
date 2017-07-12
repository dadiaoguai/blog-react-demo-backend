const models = require('../models').models,
  {ApiDialect, Arg} = require('../components').ApiDialect,
  Model = require('../components').Model.Basic

sequelize = require('../models').sequelize

exports.getlist = (req, res) => {
  let [api, article] = [new ApiDialect(req, res), new Model('article')]
  let args = [new Arg('limit', false, 'integer'), new Arg('offset', false, 'integer')]

  if (!api.setArgs(args)) {
    return
  }

  api.args.accountId = req.user.id
  article
    .setWherestr(api.args)
    .all()
    .then(objs => {
      api
        .setResponse(objs)
        .send()
    })
    .catch(err => api.error(err))
}

exports.new = (req, res) => {
  let api = new ApiDialect(req, res)
  let body = req.body

  body.accountId = req.user.id
  models.article
    .create(body)
    .then(obj => {
      api
        .setResponse(obj)
        .send()
    })
    .catch(err => res.json(err))
}

exports.get = (req, res) => {
  let id = req.params.id;

  models.article.findOne({where: {id}})
    .then(obj => res.json(obj))
    .catch(err => res.json(err))
}

