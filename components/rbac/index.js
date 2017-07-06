const RBAC = require('rbac').default,
WebError = require('web-error').default,
models = require('../../models').models,
config = require('config').get('args'),
_ = require('lodash');

const unAuthenticatedCode = 401;

exports.buildRbacArgs = async cb => {
  let args = {
    roles: [],
    permissions: {},
    grants: {}
  };

  let roles = await models.role.findAll({
    where: {status: config.status.normal},
    include: [{
      model: models.grant,
      where: {status: config.status.normal},
      include: [{model: models.permission}],
      required: false
    }]
  });
  let permissions = await models.permission.findAll({where: {status: config.status.normal}});

  args.roles = roles.map(i => i.id);

  permissions.forEach(p => {
    if (!_.has(args.permissions, p.target)) {
      args.permissions[p.target] = [p.operation];
    }
    if (_.has(args.permissions, p.target) && !args.permissions[p.target].includes(p.operation)) {
      args.permissions[p.target].push(p.operation)
    }
  });
  roles.forEach(role => {
    args.grants[role.id] = role.grants.map(grant => {
      if (!_.isNull(grant.permissionId) && _.isNull(grant.childRole)) {
        return `${grant.permission.operation}_${grant.permission.target}`
      } else if (!_.isNull(grant.childRole) && _.isNull(grant.permissionId)) {
        return grant.childRole
      } else {
        return false
      }
    })
  });

  return new RBAC(args, (err, rbac) => {
    if (err) {
      throw new err();
    }
    return cb(rbac)
  })
};

exports.can = (rbac, operation, target) => {
  let pass = false;

  return (req, res, next) => {
    if (req.user && req.user.roles.length !== 0) {
      req.user.roles.forEach(role => {
        rbac.can(role.id, operation, target, (err, can) => {
          if (err) {
            throw err;
          }
          if (can) {
            pass = true;
          }
        })
      });
    }

    if (pass) {
      return next()
    }
    return req.isAuthenticated() ? next(new WebError(unAuthenticatedCode)) : next(new Error('用户未登录'))

  }
};


