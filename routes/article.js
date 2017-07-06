const models = require('../models').models;

exports.getlist = (req, res) => {
  models.article.findAll()
    .then(objs => {
      res.json(objs)
    })
    .catch(err => res.json(err))
};

exports.new = (req, res) => {
  let body = req.body;
  body.accountId = req.user.id
  models.article.create(body)
    .then(objs => {
      res.json(objs)
    })
    .catch(err => res.json(err))
};

exports.get = (req, res) => {
  let id = req.params.id;

  models.article.findOne({where: {id}})
    .then(obj => res.json(obj))
    .catch(err => res.json(err))
};

