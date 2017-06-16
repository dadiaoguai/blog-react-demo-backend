const
  cfg = require('../config/appconfig/args'),
  Model = require('../components/models').Basic,
  {ApiDialect, Arg} = require('../components').ApiDialect,
  common = require('../components').Common;

const defaultLimit = 5,
  existedAccountError = 51;

exports.getlist = (req, res) => {
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  let args = [
    new Arg('limit').setDefault(defaultLimit), new Arg('offset', true, 'integer'), new Arg('username')
  ];

  if (!api.setArgs(args)) {
    return;
  }

  let attrs = ['$all', 'include.article.id,title?status=1&title_in=1,2&required']
  let run = async () => {
    let obj = await model.setWherestr(api.args).setAttributes(attrs).setOrder([['createdAt', 'DESC']]).cacherfy().all();

    api.setResponse(obj).send({
      remove: ['updatedAt'],
      dateFormat: ['YYYY-MM-DD', 'createdAt']
    })
  }

  run()
    .catch(err => api.error(err));
};

exports.new = (req, res) => {
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  let args = [
    new Arg('username', true), new Arg('password', true)
  ];

  if (!api.setArgs(args)) {
    return;
  }

  let run = async () => {
    api.args.password = common.computedPassword(api.args.password);
    let account = await model.model.findOne({where: {status: cfg.status.normal}});

    if (account) {
      throw new Error(existedAccountError);
    }
    let obj = await model.create(api.args);

    api.setResponse(obj).send({remove: ['password']})
  };

  run().catch(err => api.error(err))
};

exports.get = (req, res) => {
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  let resOptions = {dateFormat: ['YYYY-MM-DD HH:mm', 'createdAt', 'updatedAt']};
  let args = [
    new Arg('id', true)
  ];

  if (!api.setArgs(args)) {
    return;
  }
  model.setWherestr(api.args).one()
    .then(obj => api.setResponse(obj).send(resOptions))
    .catch(err => api.error(err))

};

exports.update = (req, res) => {
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  if (api.setArgs(['id?required', 'username', 'password'])) {
    model.update(api.args)
      .then(api.send())
      .catch(err => api.error(err))
  }
};

exports.delete = (req, res) => {
  let api = new ApiDialect(req, res);
  let model = new Model('account');

  if (api.setArgs(['id?required'])) {
    api.args.status = 0;
    model.update(api.args)
      .then(api.send())
      .catch(err => api.error(err))
  }
};

exports.login = (req, res) => {
  let api = new ApiDialect(req, res);

  api.setResponse(req.user).send({remove: ['password']})
};

exports.logout = (req, res) => {
  req.logout();
  res.json({
    msg: '登出成功',
    status: 'success'
  })
};
