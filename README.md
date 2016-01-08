# bulbo v1.0.1 [![Build Status](https://travis-ci.org/kt3k/bulbo.svg?branch=master)](https://travis-ci.org/kt3k/bulbo) [![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master) <img width="70" align="right" src="https://kt3k.github.io/bulbo/media/logo.svg" />


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
import frontMatter from 'gulp-front-matter'
import wrap from 'gulp-wrap'

asset('source/**/*.js', {read: false})(src => src
  .pipe(through(function (file) {
    file.contents = browserify(file.path).bundle()
    this.queue(file)
  })))

asset('source/**/*.css')

asset('source/*.html')(src => src
  .pipe(frontMatter())
  .pipe(wrap(function (data) {
    return fs.readFileSync('source/layouts/' + data.file.frontMatter.layout).toString()
  })))

asset(['source/**/*', '!source/**/*.{js,css,html,lodash}'])
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

## bulbo.asset(glob, opts)

- @param {String|String[]} glob The glob pattern(s)
- @param {Object} [opts] The options
- @param {String} [opts.base] The base path.
- @param {String|String[]} [opts.watch] The glob(s) to watch (optional)
- @param {Object} [opts.watchOpts] The options to pass to watcher (optional)

This registers the glob pattern as the asset source.

Example:
```js
bulbo.asset('src/js/**/*.js')
```

`opts.watch` is used for specifying the watching path. If nothing's give, bulbo automatically watches the same path as the asset glob. So this is useful when the asset entry points and the actual source files are different.

`opts.watchOpts` is passed directly to the watcher (actually `chokidar`) as its options.

Example:
```js
bulbo.asset('src/js/pages/*.js', {
  watch: 'src/js/**/*.js' // Watches under all js files under `src/js`, though build entry poits are only js files under `src/js/pages`.
})(src => src
  .pipe(through(file => {
    file.contents = browserify(file.path).bundle()
  }))
```

`opts.base` used for changing the base path of the glob pattern(s).

Example:
```js
bulbo.asset('src/img/**/*.*') // `src/img/foo.png` is copied to `build/foo.png`

bulbo.asset('src/img/**/*.*', {base: 'src'}) // but in this case, copied to `build/img/foo.png`
```

## bulbo.asset(glob, opts)(modifier)

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

# Recipes

## Uglify scripts only when it's production build

Use `gulp-if`:

```js
import gulpif from 'gulp-if'
import uglify from 'gulp-uglify'

asset('source/**/*.js')(src => src
  .pipe(gulpif(process.NODE_ENV === 'production', uglify()))
```

This uglifies the scripts only when the variable NODE_ENV is `'production'`.

## Use *X* Template engine

Use engine option in `gulp-wrap`:

```js
import wrap from 'gulp-wrap'
import frontMatter from 'gulp-front-matter'

asset('source/**/*.html')(src => src
  .pipe(frontMatter())
  .pipe(wrap({src: 'source/layout.nunjucks'}, null, {engine: 'nunjucks'})))
```
***Note*** You need to `npm install nunjucks` in this case.

This example wraps your html in the nunjucks template. The contents of each html file is refereced by `contents` and the front matter by `file.frontMatter`.

## Watch different paths from source path.

# License

MIT

# Release history

- 2016-01-08   v1.0.1   Fix build number limit bug ( https://github.com/kt3k/bulbo/commit/225358fa4c429b3d50dc9efefd93a6d644fd12f6 ).
- 2016-01-03   v1.0.0   Initial release.
