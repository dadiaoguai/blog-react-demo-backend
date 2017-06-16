const {ApiDialect, Arg} = require('../components').ApiDialect

const
  userAuthError = 11,
  unLogin = 12;

exports.handler = (req, res) => {
  let api = new ApiDialect(req, res);

  api.setArgs([new Arg('type')]);

  switch (api.args.type) {
  case 'login':
    return api.error(new Error(userAuthError));
  case 'notLogin':
    return api.error(new Error(unLogin));
  default:
    return api.error(new Error(0))
  }
};
