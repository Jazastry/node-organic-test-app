var qs = require('query-string')
var _ = require('lodash')
var urlParams = require('url-params')
var dna = require('webpack-dna-loader!')

var findParentLink = function (el) {
  if (el.attributes.href) return el
  if (!el.parentNode) return
  return findParentLink(el.parentNode)
}
var router = window.plasma.router
var navigate = function (e, query, forceRefresh, inNewTab) {
  var href
  if (e.ctrlKey || e.which === 2 || e.button === 4) return
  if (e.preventDefault) {
    e.preventDefault()
    e.preventUpdate = true
    var el = findParentLink(e.target)
    href = el.attributes.href.value
  }
  if (typeof e === 'string') {
    href = e
  }
  if (href) {
    // add the query parameters
    var pureHref = _.clone(href)
    if (query) href += '?' + qs.stringify(query)

    if (inNewTab || href.indexOf(router.root) !== 0) {
      // navigate in new tab if option is set
      // handles links outside of app context
      window.navigatePage(href, inNewTab)
    } else if (window.location.pathname === pureHref && window.history && window.history.pushState && !forceRefresh) {
      // when the path is the same (for example going from '/admin/users?page=2' to '/admin/users?page=1')
      // and the history is supported by the browser
      // there is no need to refresh the page, but just to update the url
      window.history.pushState(null, null, href)
    } else {
      // If we're using the Navigo router, the second parameter specifies
      // whether the path is absolute. When using Director, router.navigate is
      // defined by us and it doesn't accept a second parameter, so we're safe
      // to pass it.
      router.navigate(href, true)
    }
  }
}

var addLangParamToUrl = function (url) {
  if (!url) return url
  var currentParams = urlParams.get()
  if (!currentParams.lang) return url
  var splitUrl = url.split('?')
  if (splitUrl.length === 1) return url + '?lang=' + currentParams.lang
  var existingParams = qs.parse(splitUrl[1])
  existingParams.lang = currentParams.lang
  return splitUrl[0] + '?' + qs.stringify(existingParams)
}

var getMainSiteLink = function (page) {
  var currentLang = window.plasma.i18n.lang || 'bg'
  var hostSpecificMainSiteUrls = dna.mainSiteUrls[window.location.host] || _.values(dna.mainSiteUrls)[0]
  return hostSpecificMainSiteUrls[currentLang][page] || hostSpecificMainSiteUrls.main
}

module.exports = function (tag) {
  tag.router = router
  tag.navigate = navigate
  tag.getUrlParams = urlParams.get
  tag.addLangParamToUrl = addLangParamToUrl
  tag.getMainSiteLink = getMainSiteLink
  tag.onRoute = function (route, callback) {
    var pattern = {
      type: 'url-change',
      url: route
    }
    window.plasma.on(pattern, callback)
    tag.on('unmount', function () {
      window.plasma.off(pattern, callback)
    })
  }
  tag.onRouteChange = function (callback) {
    var pattern = {
      type: 'url-change'
    }
    window.plasma.on(pattern, callback)
    tag.on('unmount', function () {
      window.plasma.off(pattern, callback)
    })
  }
}
module.exports.router = router
module.exports.navigate = navigate
module.exports.getUrlParams = urlParams.get
module.exports.addLangParamToUrl = addLangParamToUrl
module.exports.getMainSiteLink = getMainSiteLink
