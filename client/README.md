# The `client` Directory

## Overview

The `client` directory contains all frontend SPA web applications, implemented with [`organic-oval`](https://github.com/camplight/organic-oval).

```
client/
  |- apps/
  |- common/
  |- page-helpers/
  |- pages/
  |- |- index.js
  |- vendor/
```

* `client/apps` - contains SPAs with entry points:
  * `.bundle.js`
  * `.bundle.css`
* `client/common` - contains common scripts and tags used across the SPAs
  * `models` - models used accross the system
* `client/page-helpers` - contains helper server-side nodejs code to load data into sent pages
* `client/pages` - contains [ejs](http://www.embeddedjs.com/) templates for each SPA
  * `client/pages/index.js` - contains server-side routes for the serving of templates
* `client/vendor` - contains various 3rd party libraries which are modified by the dev team

## apps

### app as cell

```
// some.index.bundle.js

require('cell')({
  root: '/dashboard',
  urls: {
    groupEdit: 'groups/:groupId/edit',
    accountEdit: 'groups/:groupId/accounts/:accountId'
  },
  protected: true,
  redirectNotAuthorized: 'login',
  requireTags: function () {
    require('./dashboard-view')
  }
})

```

### global utilities

#### window.plasma
  * `window.plasma.router` via `plasma/router`

#### window.navigatePage

```
window.navigatePage('login')
```

### models

#### user control chemicals

```
var User = require('models/user')
var user = new User({})
user.login({email: "", password: ""}) // fires `login` chemical on success
user.register(data) // fires `register` chemical on success
user.logout() // fires `logout` chemical on success
```

### organelles

### component based development

#### structure

* `component-name`
  * `index.tag` - the component's entry point as html code.
  * `style.less` - the component's style.
  * `tag.js` - the component's javascript code.

### utils/common

#### scoped class

```
// style.less
:local(.class) {

}
```

```
<component1>
  <script>
    this.root.className = require('./style.less').class
  </script>
</component1>
```

#### router-tag

```
// having initialized plasma/router with dna:
var dna = {
  root: '',
  urls: {
    slugRoute: 'some/url/path/:slug'
  }
}
```

```
<component1>
  <script>
    require('router-tag')(this)
    var tag = this
    tag.onRoute(tag.router.url.slugRoute(), function (params) {
      console.log(params.slug)
      if (params.slug === 1) {
        tag.navigate('some/url/path/2')
      }
    })
  </script>
  <a href='router.url.slugRoute(1)' onclick={tag.navigate} />
</component1>
```
