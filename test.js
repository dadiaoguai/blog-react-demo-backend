const {models, sequelize} = require('./models')

// let run = async t => {
//   let a = await models.test1.create({transaction: t})
//   let b = await models.test2.create({test1Id: a.id}, {transaction: t})
//   let c = await models.test2.create({test1Id: a.id}, {transaction: t})
//
//   await b.destroy({
//     truncate: true,
//     transaction: t
//   })
//   return models.test1.findOne({
//     where: {id: a.id},
//     include: [{model: models.test2}],
//     transaction: t
//   })
// }
//
// sequelize.transaction(t => run(t))
//   .then(obj => console.log(obj.toJSON()))
//   .catch(err => console.log(err))


