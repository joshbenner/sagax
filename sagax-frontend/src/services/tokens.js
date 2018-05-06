import get from 'lodash/get'
import keys from 'lodash/keys'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'

let tokenPattern = /:::([^|]+?)(?:\|(.+?))?:::/g

export function tokenReplace (val, data) {
  if (isString(val)) {
    return val.replace(tokenPattern, (match, path, dfault) => {
      return get(data, path, dfault)
    })
  } else if (isArray(val)) {
    return val.map((v) => tokenReplace(v, data))
  } else if (isPlainObject(val)) {
    let out = {}
    for (let key of keys(val)) {
      out[key] = tokenReplace(val[key], data)
    }
    return out
  } else {
    return val
  }
}
