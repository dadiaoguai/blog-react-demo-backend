const
  should = require('should'),
  _ = require('lodash');

// 测试相关
exports.shouldSuccess = obj => should(obj).be.equal('success');
exports.shouldFailed = obj => should(obj).be.equal('failed');
exports.shouldOwnProperty = (obj, prop) => should(obj).have.ownProperty(prop);
exports.shouldNotOwnProperty = (obj, prop) => should(obj).not.have.ownProperty(prop);

/*
 * res 断言判断
 *
 * @param status string
 * @param done function
 * @param length integer
 * @param fields object
 * @param handler function
 *
 * @return function
 */
let _has = (fields, obj) => {
  Object.keys(fields).forEach(k => {
    obj.should.has.ownProperty(k);
    if (_.isString(fields[k]) || _.isNumber(fields[k])) {
      obj[k].should.equal(fields[k])
    }
    if (_.isObject(fields[k])) {
      _has(fields[k], obj[k])
    }
    if (_.isArray(fields[k])) {
      fields[k].every(arg => obj[k].includes(arg)).should.be.ok()
    }
  })
};

exports.resAssertion = (done, status = 'success', length = 0, fields = {}, handler) => (err, res) => {
  if (err) {
    return done(err);
  }
  should(res.body.status).be.equal(status);

  if (!Number.isInteger(length)) {
    throw new Error('参数: length 的类型必须是整数!');
  }
  if (length >= 0) {
    res.body.objs.length.should.be.equal(length);
  }

  if (typeof fields !== 'object' || Array.isArray(fields)) {
    throw new Error('参数: fields 的类型必须是 Object, 且不能是 Array! ');
  }

  if (!_.isEmpty(fields)) {
    _has(fields, res.body)
  }

  if (handler) {
    return handler(res, done);
  }

  return done()
};

/*
 * 随机数字生成器
 */
exports.numberGenerate = (max, min = 0) => {
  let value = Math.round(Math.random() * max);


  return value < min ? exports.numberGenerate(max, min) : value;
};

/*
 * remove 改名为 clear
 *
 * 删除 object 中值 null 或者 undefined 的属性
 * @param {object|array} obj
 * @param {array} rm
 *
 * @return {object}
 */
exports.clear = (obj, rm) => {
  if (rm && !_.isArray(rm)) {
    throw new Error('remove 函数, rm 参数类型必须为 array');
  }

  if (_.isArray(obj) || _.isObject(obj)) {
    Object.keys(obj).forEach(i => {
      if (_.isNaN(obj[i]) || _.isNull(obj[i]) || _.isUndefined(obj[i])) {
        delete obj[i];
        return
      }

      if (rm && rm.includes(i)) {
        delete obj[i];
        return
      }

      if (_.includes(['object', 'string'], typeof obj[i]) && !_.isDate(obj[i])) {
        _.isEmpty(obj[i]) ? delete obj[i] : exports.clear(obj[i], rm)
      }
    })
  }

  return obj
};


/*
 * 删除对象或者数组中的特定字段
 * @param {object} obj
 * @param {array} rm
 *
 * @return {object{
 */
exports.removeFields = (obj, rm) => {
  if (rm && !_.isArray(rm)) {
    throw new Error('remove 函数, rm 参数类型必须为 array');
  }

  if (_.isArray(obj) || _.isObject(obj)) {
    Object.keys(obj).forEach(i => {
      if (rm.includes(i)) {
        delete obj[i];
        return
      }
      if (_.isObject(obj[i]) && !_.isDate(obj[i])) {
        exports.removeFields(obj[i], rm)
      }

    })
  }

  return obj
};


