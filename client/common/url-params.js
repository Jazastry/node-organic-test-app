var qs = require('query-string')

module.exports.get = function () {
  return qs.parse(window.location.search)
}
