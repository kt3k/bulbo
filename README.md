# bulbo v1.0.0 [![Build Status](https://travis-ci.org/kt3k/bulbo.svg?branch=master)](https://travis-ci.org/kt3k/bulbo) [![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master) <img width="70" align="right" src="https://kt3k.github.io/bulbo/media/logo.svg" />


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
import frontmatter from 'gulp-front-matter'
import wrap from 'gulp-wrap'

asset('source/**/*.js', {read: false})(src =>
  src.pipe(through(function (file) {
    file.contents = browserify(file.path).bundle()
    this.queue(file)
  })))

asset('source/**/*.css')

asset('source/**/*.lodash')(src =>
  src
  .pipe(frontmatter())
  .pipe(wrap({src: './layout.lodash'})))

asset(['source/**/*', '!source/**/*.{js,css,lodash}'])
```

And then the following command starts the server.

```
bulbo serve
```

And the following builds all the given assets and the result are saved under `build/` directory.

```
bulbo build
```

# API

```js
var bulbo = require('bulbo')
```

## bulbo.asset(glob)

- @param {String|String[]} glob The glob pattern(s)

This registers the glob pattern as the asset source.

Example:
```js
bulbo.asset('src/js/**/*.js')
```

## bulbo.asset(glob)(modifier)

- @param {Function} modifier The asset modifier

This registers the asset modifier for the asset. The modifier is called with the paramter of source file (`vinyl` type) stream and must return a transformed stream. It throws exception if the modifier does not return a readable stream.

Because the stream which is passed to modifier is `vinyl` stream, which is the same as `gulp.src(glob)` in `gulp`, you can use any gulp-plugins or gulp compatible stream processors for passing through it.

Example:
```js
bulbo.asset('src/js/**/*.js')(function (src) {

    return src.pipe(through(function (file) {

        file.contents = browserify(file.path).bundle()

        this.queue(file)

    }))

})
```

## bulbo.dest(path)

- @param {String} path

This sets the build destination. (The default is `build`)

Example:
```js
bulbo.dest('dist')
```

## bulbo.port(port)

- @param {Number} port

This sets the port number of the asset server. (The default is `7100`.)

Example:
```js
bulbo.port(7500)
```

# Commands

`npm install -g bulbo` installs command `bulbo`. Which supports 2 subcommands `build` and `serve`.

## bulbo build

This builds all the registered assets into the destination directory. The defualt destination is `build`. The path is configurable by `bulbo.dest(path)` in bulbofile.

## bulbo serve

This starts the local server which serves all the registered assets on it. The default port is `7100`. The number is configurable by `bulbo.port(number)` in bulbofile.

`bulbo` command without arguments also does the same as `bulbo serve`. You can just simply call `bulbo` to start bulbo server.

The bulbo server has builtin debug url at `0.0.0.0:7100/__vinyl__`. You can find there all the available paths (assets) on the server. It's useful for debugging the asset stream.

![](https://kt3k.github.io/bulbo/media/ss.png)

# License

MIT
