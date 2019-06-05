module.exports = function (plasma, dna, helpers, app) {
  return {
    '* /': function (req, res, next) {
      res.redirect('/landing')
    },
    '* /*': function (req, res, next) {
      helpers.attachAppName(dna, req, res)
      next()
    },
  }
}
