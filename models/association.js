module.exports = models => {
  models.account.hasMany(models.article);
  models.article.belongsTo(models.account);

  models.role.belongsToMany(models.account, {
    through: models.AccountRole,
    unique: false
  });
  models.account.belongsToMany(models.role, {
    through: models.AccountRole,
    unique: false
  });

  models.grant.belongsTo(models.role);
  models.grant.belongsTo(models.permission);
  models.role.hasMany(models.grant);
  models.permission.hasMany(models.grant)
};
