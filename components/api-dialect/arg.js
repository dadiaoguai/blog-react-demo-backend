/*
 * 生成一个参数对象
 */

class Arg {
  constructor (name, required = false, type) {
    this.name = name;
    this.required = required;
    this.type = type;
  }

  setDateFormat (format) {
    this.dateFormat = format;

    return this
  }

  setDefault (dft) {
    this.dft = dft;

    return this
  }

  setStrict (x) {
    this.strict = x || true;

    return this
  }

  setAllowNull (x) {
    this.allowNull = x || true;

    return this
  }
}

module.exports = Arg
