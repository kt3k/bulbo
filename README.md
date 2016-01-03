# bulbo v0.1.2 [![Build Status](https://travis-ci.org/kt3k/bulbo.svg?branch=master)](https://travis-ci.org/kt3k/bulbo) [![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master)

[![npm bulbo](https://nodei.co/npm/bulbo.png?compact=true)](https://www.npmjs.com/package/bulbo)

> Stream oriented static site generator, based on gulp ecosystem

# Install

```
npm install --save-dev bulbo
```

# Usage

First you need to set up `bulbofile.js` like the following.

```js
import {asset} from 'bulbo'

import through from 'through'
import browserify from 'browserify'
import frontmatter from 'gulp-frontmatter'

asset('source/**/*.js', {read: false})(src =>
  src.pipe(through(function (file) {
    file.contents = browserify(file.path).bundle()
    this.queue(file)
  })))

asset('source/**/*.css')

asset('source/**/*.ejs')(src => src.pipe(frontmatter()))

asset(['source/**/*', '!source/**/*.{js,css,ejs}'])
```

And then the following command starts the server.

```
bulbo serve
```

And the following build all assets under `build/` directory.

```
bulbo build
```

# License

MIT
