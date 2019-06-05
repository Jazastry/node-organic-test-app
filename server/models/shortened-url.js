var generate = require('nanoid/generate')
var mongoose = require('mongoose')

var ID_LENGTH = 7
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

var struct = {
  original: { type: String, required: true }, // like app.webadvisor.com/patient/something
  shortenedId: { type: String, required: true, unique: true } // like 1a2b3c
}
var schema = new mongoose.Schema(struct)
require('./plugins')(schema, struct)

schema.static('generate', function (originalURL, next) {
  var shortened = new Model({
    original: originalURL,
    shortenedId: generate(ALPHABET, ID_LENGTH)
  })
  shortened.save(next)
})

schema.static('generateBatch', function (originalURLs, next) {
  // collect documents to be inserted
  var shortened = originalURLs.map(function (o) {
    return {
      original: o,
      shortenedId: generate(ALPHABET, ID_LENGTH)
    }
  })

  // batch create documents
  Model.create(shortened, next)
})

mongoose.set('useCreateIndex', true) // https://github.com/Automattic/mongoose/issues/6890#issuecomment-417050608
var Model = mongoose.model('ShortenedURL', schema)
module.exports = Model
