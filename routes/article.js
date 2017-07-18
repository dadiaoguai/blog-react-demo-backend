const
  {ApiDialect, Arg} = require('../components').ApiDialect,
  Model = require('../components').Model.Basic,
  {sequelize, models} = require('../models')

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
  let [api, article, tag] = [new ApiDialect(req, res), new Model('article'), new Model('tag')]
  let args = [
    new Arg('title', true),
    new Arg('author').setDefault('无名'),
    new Arg('content'),
    new Arg('tags', false, 'array')
  ]

  if (!api.setArgs(args)) {
    return
  }

  api.args.accountId = req.user.id
  let run = async t => {
    let obj = await article.create(api.args, t)

    if (!_.isEmpty(api.args.tags)) {
      let tags = await tag.findOrCreate(api.args.tags.map(tag => ({name: tag})), t)

      await obj.setTags(tags, {transaction: t})
    }
    return obj
  }

  sequelize.transaction(t => run(t))
    .then(obj => {
      api
        .setResponse(obj)
        .send()
    })
    .catch(err => api.error(err))
}

exports.get = (req, res) => {
  let [api, article] = [new ApiDialect(req, res), new Model('article')]
  let args = [new Arg('id', true)]

  if (!api.setArgs(args)) {
    return
  }

  article
    .setWherestr(api.args)
    .one()
    .then(obj => {
      api
        .setResponse(obj)
        .send()
    })
    .catch(err => api.error(err))
}

exports.update = (req, res) => {
  let [api, article, tag] = [new ApiDialect(req, res), new Model('article'), new Model('tag')]
  let args = [
    new Arg('id', true),
    new Arg('title'),
    new Arg('author'),
    new Arg('content'),
    new Arg('tags', false, 'array')
  ]

  if (!api.setArgs(args)) {
    return
  }

  let run = async t => {
    let obj = await article.setWherestr({id: api.args.id}).one(true, t)

    if (!_.isEmpty(api.args.tags)) {
      let tags = await tag.findOrCreate(api.args.tags.map(tag => ({name: tag})), t)

      await obj.setTags(tags, {transaction: t})
    }

    return article.update(api.args, t)
  }

  sequelize.transaction(t => run(t))
    .then(obj => {
      api
        .setResponse(obj)
        .send()
    })
    .catch(err => api.error(err))
}

exports.delete = (req, res) => {
  let api = new ApiDialect(req, res)
  let args = [new Arg('id', true)]

  if (!api.setArgs(args)) {
    return
  }

  models.article.update({status: 0}, {where: {id: api.args.id}})
    .then(obj => {
      api
        .setResponse(obj)
        .send()
    })
    .catch(err => api.error(err))
}

exports.test = (req, res) => {
  models.tag.findOrCreate({where: {name: 'test'}})
    .then(obj => {
      console.log(obj[0])
      res.send('1')
    })
    .catch(err => console.log(err))
}

