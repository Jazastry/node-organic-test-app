var qs = require('query-string')

// the problem occurs whenever the user tries to navigate to a route,
// within 500ms after page load
// https://github.com/flatiron/director/blob/v1.2.8/lib/director/browser.js#L57-L65
// for more info here https://github.com/flatiron/director/issues/312
var shim_director_wait_for_window_onpopstate_on_setRoute = function (router) {
  var oldSetRoute = router.setRoute
  router.setRoute = function () {
    var args = arguments
    if (window.onpopstate) {
      oldSetRoute.apply(router, args)
      router.setRoute = oldSetRoute
    } else {
      setTimeout(function () {
        router.setRoute.apply(router, args)
      }, 100)
    }
  }
}

module.exports = function (plasma, dna) {
  var Director = require('director/build/director').Router
  var router = plasma.router = new Director(dna.routes).configure(dna.director)
  shim_director_wait_for_window_onpopstate_on_setRoute(router)

  router.url = {}
  router.root = dna.root
  router.navigate = function (path) {
    router.setRoute(path)
  }
  if (dna.params) {
    for (var param in dna.params) {
      router.param(param, dna.params[param])
    }
  }
  var buildUrlFn = function (key) {
    var matches = dna.urls[key].match(/\:([a-zA-Z0-9]*)/g)
    router.on(dna.urls[key], function () {
      var query = qs.parse(window.location.search)
      var params = {}
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          params[matches[i].replace(':', '')] = arguments[i]
        }
      }
      window.plasma.storeAndOverride({
        type: 'url-change',
        url: dna.urls[key],
        params: params,
        query: query
      })
    })
    return function () {
      var result = dna.urls[key]
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          result = result.replace(matches[i], arguments[i] || matches[i])
        }
      }
      return result
    }
  }
  for (var key in dna.urls) {
    router.url[key] = buildUrlFn(key)
  }

  router.init()
}
