if (typeof Promise === 'undefined') {
  require('es6-promise').polyfill()
}
window.globalOval = true
window.ovalRegisterMultiple = true

require('custom-event-polyfill')

module.exports = function (options) {
  var dna = require('webpack-dna-loader!')
  var Plasma = require('organic-plasma')
  var Router = require('./plasma/router')
  var urlParams = require('url-params')

  var oldOnError = window.onerror
  window.onerror = function () {
    if (oldOnError) {
      return oldOnError.apply(this, arguments)
    }

    require('./handle-exception').apply(this, arguments)
  }

  window.navigatePage = require('./navigate-page')

  window.plasma = new Plasma()
  window.plasma.legacyApp = true
  window.plasma.debug = dna.debug

  window.plasma.organelles = [
    new Router(window.plasma, {
      root: options.root,
      urls: dna.fronturls,
      params: options.urlParams,
      director: {
        html5history: true
      }
    })
  ]

  if (options.protected) {
    if (!window.plasma.currentUser.id) {
      return window.navigatePage(options.redirectNotAuthorized || 'login?redirect_url=' + encodeURIComponent(window.location.pathname + window.location.search))
    }
  }

  var initOval = async function () {
    oval.init()
    if (options.globalDirectives) {
      var oldBaseTag = oval.BaseTag
      oval.BaseTag = function (tag, tagName, rootEl, rootProps, rootAttributes) {
        oldBaseTag(tag, tagName, rootEl, rootProps, rootAttributes)
        tag.injectDirectives(options.globalDirectives)
      }
    }
  }

  var mountTags = async function () {
    options.requireTags()
    oval.mountAll(document.body)
    window.plasma.emit('ovalLoaded')
  }

  require('domready')(function () {
    Promise.resolve()
      .then(initOval)
      .then(mountTags)
  })
}
