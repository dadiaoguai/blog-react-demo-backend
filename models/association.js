module.exports = models => {
  models.account.hasMany(models.article)
  models.article.belongsTo(models.account)

  models.role.belongsToMany(models.account, {
    through: models.AccountRole,
    unique: false
  })
  models.account.belongsToMany(models.role, {
    through: models.AccountRole,
    unique: false
  })

  models.tag.belongsToMany(models.article, {
    through: models.ArticleTag,
    unique: false
  })
  models.article.belongsToMany(models.tag, {
    through: models.ArticleTag,
    unique: false
  })

  models.grant.belongsTo(models.role)
  models.grant.belongsTo(models.role, {foreignKey: 'childRole'})
  models.grant.belongsTo(models.permission)
  models.role.hasMany(models.grant)
  models.permission.hasMany(models.grant)

  models.test1.hasOne(models.test2)
  models.test2.belongsTo(models.test1)
}
