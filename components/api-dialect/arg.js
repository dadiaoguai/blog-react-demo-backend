/*
 * 生成一个参数对象
 */

class Arg {
  constructor (name, required = false, type) {
    this.name = name
    this.required = required
    this.type = type
  }

  setDateFormat (format) {
    this.dateFormat = format

    return this
  }

  setDefault (dft) {
    this.dft = dft

    return this
  }

  setStrict (x) {
    this.strict = x || true

    return this
  }

  setRequired (x) {
    this.required = x || true

    return this
  }

  setRange (range, ...rest) {
    if (Array.isArray(range)) {
      this.range = [...range, ...rest]
    } else {
      this.range = [range, ...rest]
    }

    return this
  }
}

module.exports = Arg
