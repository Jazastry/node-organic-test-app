var path = require('path')
module.exports = function (p) {
  return require(path.join(process.cwd(), 'server', p))
}
