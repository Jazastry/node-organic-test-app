module.exports = function (pagePath, inNewTab) {
  if (pagePath.indexOf('/') !== 0 && pagePath.indexOf('http') !== 0) {
    pagePath = '/' + pagePath
  }
  if (inNewTab) {
    window.open(pagePath, '_blank')
  } else {
    window.location = pagePath
  }
}
