var format = require('string-template')
var $require = require(process.cwd() + '/server/lib/require')

module.exports = function (plasma, dna) {
  var ShortenedURL = $require('models/shortened-url')

  plasma.on('ExpressServer', function (c) {
    var app = c.data || c[0].data

    app.get('/s/:shortenedId', function (req, res, next) {
      ShortenedURL.findOne({shortenedId: req.params.shortenedId}).exec(function (err, shortened) {
        if (err) {
          plasma.emit({type: 'ErrorFound', err: err})
          res.redirect('/404')
        } else if (!shortened) {
          res.redirect('/404')
        } else {
          res.redirect(shortened.original)
        }
      })
    })
  })

  plasma.on('shortenURL', function (c, next) {
    ShortenedURL.generate(c.url, function (err, created) {
      if (err) return next(err)
      return next(null, format(dna.fronturls.shortenedURL, {shortenedId: created.shortenedId}))
    })
  })
}
