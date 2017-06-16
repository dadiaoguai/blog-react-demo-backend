const account = require('./account'),
  article = require('./article'),
  error = require('./error');

// const accessValidator = require('../components').RBAC,
//   Passport = require('../components').Passport;

module.exports = (router, passport, rbac) => {
  router.route('/login')
    .post(passport.authenticate('local', {
      failureRedirect: '/error/login',
      failureFlash: true
    }), account.login);

  router.route('/logout')
    .put(account.logout);

  router.route('/error/:type')
    .get(error.handler);

  router.route('/accounts')
    .get(account.getlist)
    .post(account.new);

  router.route('/accounts/:id')
    .get(account.get)
    .put(account.update);

  router.route('/articles')
    .get(article.getlist)
    .post(article.new);

  router.route('/articles/:id')
    .get(article.get)
};
