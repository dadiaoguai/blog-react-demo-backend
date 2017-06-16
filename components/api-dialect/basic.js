const
  _ = require('lodash'),
  moment = require('moment'),
  errors = require('config').errors,
  common = require('../common').Basic,
  cfg = require('config').get('args');

class ApiDialect {
  constructor (req, res) {
    this.req = req;
    this.res = res;
    this.args = null;
    this.sent = false;
    this.result = {}
  }

  /*
   * 从 req 中拿到所有的参数,并进行预处理, 返回标准格式的 args
   * args 参数要求必须是是 Arg的实例
   * Arg {
   *    name: 字段名称,
   *    required: 该字段是否可以为空, 默认为 false,
   *    type: [number|boolean|string|integer|array|array|json] 根据 type 的值转换响应的类型,
   *    default: 如果字段对应的值为空, 则赋默认值,
   *    dateFormat: 日期格式规范化
   *    strict: 严格模式, 如果 strict 为 true, 那么 字段对应的值必须与 type 类型保持一致
   *  }
   *
   * @param {array} args, 标准化处理需要的参数
   *
   * @return {boolean}
   */
  setArgs (args) {

    /* ------------------------ 参数判断 ---------------------------------- */
    if (!_.isArray(args)) {
      throw new Error('参数类型必须是Array!');
    }
    if (!args.every(arg => arg.constructor.name === 'Arg')) {
      throw new Error('参数中每个字段都必须是 Arg 的实例!');
    }

    let params = Object.assign({}, this.req.params, this.req.query, this.req.body);

    /* ------------------------ 开始处理参数 ---------------------------------- */
    let result = true;
    let stdArgs = {status: cfg.status.normal}; // 标准参数容器

    let typeSet = {
      number: _.toNumber,
      boolean: i => _.isBoolean(i) ? i : i === 'true',
      string: _.toString,
      integer: _.toSafeInteger,
      array: _.toArray,
      json: JSON.parse
    };

    args.forEach(arg => {
      let field = arg.name;

      Object.keys(params).forEach(k => {
        if (k.startsWith(field)) {
          field = k;
        }
      });

      let v = params[field];

      _.set(stdArgs, field, v);

      if (arg.required && common.isEmpty(v)) {
        this.res.json({
          msg: `参数 ${field} 不能为空`,
          code: 1,
          status: 'failed'
        });

        this.sent = true;
        result = false;

        return false
      }

      if (arg.dft && common.isEmpty(v)) {
        stdArgs[field] = arg.dft;
      }

      if (arg.type && _.has(typeSet, arg.type) && !common.isEmpty(v)) {
        if (arg.strict && !_[`is${_.upperFirst(arg.type)}`](v)) {
          let msg;

          if (_.isString(arg.strict)) {
            msg = arg.strict
          } else if (_.isNumber(arg.strict)) {
            msg = errors[arg.strict];
          } else {
            msg = `参数 ${field} 的类型必须是 ${arg.type}`
          }

          this.res.json({
            msg,
            code: 1,
            status: 'failed'
          });

          this.sent = true;
          result = false;

          return result;
        }

        stdArgs[field] = typeSet[arg.type](v)
      }

      if (arg.dateFormat && !common.isEmpty(v)) {
        stdArgs[field] = moment(v).format(arg.dateFormat);
      }

      return true
    });

    this.args = common.clear(stdArgs);

    return result
  } // 思考题, 如果是批量创建, 该怎么办?

  /*
   * 对查询出来的数据进行处理, 并发送给前端
   * 可以传入参数 opts, 对待发送的原始数据进行加工处理
   * opts = {
   *   type: json|render|ejs@default=json, 选择响应类型
   *   view: string, 模板名称 如果 type 为 render 的时候, view 必须存在
   *   blank: boolean@default=true, 是否对数据进行去空处理
   *   dateFormat: ['YYYY-MM-DD',field1, field2], 对date 类型数据进行格式化
   *   remove: [field1,field2], 删除字段
   * }
   *
   *
   * @param {object} opts 数据处理参数
   *
   * @return {Promise}
   */
  send (opts = {
    type: 'json',
    blank: true
  }) {
    let self = this;

    if (!opts.type) {
      opts.type = 'json';
    }
    if (opts.type === 'render' && !opts.views) {
      throw new Error('opts 中的 view 参数不能为空!');
    }
    if (!opts.blank) {
      opts.blank = true;
    }

    /**
     * 辅助函数, 用于发送响应
     *
     * @param {object} obj 待处理的目标
     * @return {boolean}
     */
    function _res (obj) {
      let data = _.isArray(obj) ?
        {objs: obj.every(i => i.dataValues) ? obj.map(i => i.dataValues) : obj} :
        {obj: obj && obj.dataValues ? obj.dataValues : obj};

      if (opts.type === 'render') {
        self.res[opts.type](opts.view, data);
      }

      if (opts.type === 'json') {
        data.status = 'success';
        self.res[opts.type](data)
      }

      if (opts.type === 'send') {
        self.res[opts.type](obj);
      }

      self.sent = true;

      return self.sent
    }

    let data = _extractFromSequelizeInstance(this.result);

    if (opts.blank && _.isEmpty(opts.remove)) {
      data = common.clear(data);
    }
    if (opts.blank && !_.isEmpty(opts.remove)) {
      data = common.clear(data, opts.remove);
    }
    if (!_.isEmpty(opts.remove) && !opts.blank) {
      data = common.remove(data, opts.remove);
    }

    if (opts.dateFormat) {
      let format = 0;
      let fieldIndex = 1;

      data = common.dateFormat(data, opts.dateFormat[format], opts.dateFormat.slice(fieldIndex));
    }

    if (!this.sent) {
      _res(data);
    }

    return Promise.resolve(data)
  }

  /**
   * 错误结果处理, 以 json 格式, 将错误信息发送给前端
   *
   * @param {error} err 错误代码
   *
   * @return {object}
   */
  error (err) {
    return this.res.json(
      !Number.isNaN(parseInt(err.message)) ?
        {
          msg: errors[parseInt(err.message)] ? errors[parseInt(err.message)] : errors[0],
          status: 'failed'
        } : // 多重 ? :, 要注意
        {
          msg: err.message,
          status: 'failed'
        }
    )
  }

  /**
   * 将数据库查询数据传入api 中
   *
   * @param {object} obj, 待发送的数据
   *
   * @return {object}
   */
  setResponse (obj) {
    this.result = obj;

    return this
  }
}

/**
 * 用于删除 sequleize 相关的属性
 * @param {object} obj 待处理的对象
 *
 * @return {object}
 * @inner
 */
function _extractFromSequelizeInstance (obj) {
  if (_.isArray(obj) || _.isObject(obj)) {
    Object.keys(obj).forEach(k => {
      if (/^[^a-zA-Z0-9]/.test(k)) {
        return delete obj[k];
      }

      if (_.includes(['object', 'string'], typeof obj[k]) && !_.isDate(obj[k])) {
        return _.isEmpty(obj[k]) ? delete obj[k] : _extractFromSequelizeInstance(obj[k])
      }

      return undefined;
    })
  }

  return obj
}

module.exports = ApiDialect;
