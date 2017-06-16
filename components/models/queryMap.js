const _ = require('lodash')

module.exports = {
  gt: {
    name: '$gt',
    handler: x => x
  },
  gte: {
    name: '$gte',
    handler: x => x
  },
  lt: {
    name: '$lt',
    handler: x => x
  },
  lte: {
    name: '$lte',
    handler: x => x
  },
  ne: {
    name: '$ne',
    handler: x => x
  },
  eq: {
    name: '$eq',
    handler: x => x
  },
  not: {
    name: '$not',
    handler: x => x
  },
  between: {
    name: '$between',
    handler: x => x.split(',').map(i => _.toNumber(i))
  },
  notBetween: {
    name: '$notBetween',
    handler: x => x.split(',').map(i => _.toNumber(i))
  },
  in: {
    name: '$in',
    handler: x => x.split(',').map(i => _.toNumber(i))
  },
  notIn: {
    name: '$notIn',
    handler: x => x.split(',').map(i => _.toNumber(i))
  },
  like: {
    name: '$like',
    handler: x => `%${x.split(' ').join('%')}%`
  },
  notLike: {
    name: '$notLike',
    handler: x => `%${x.split(' ').join('%')}%`
  }
}
