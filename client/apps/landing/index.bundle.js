require('cell')({
  protected: false,
  root: '/landing',
  requireTags: function () {
    require('./index.tag')
  }
})
