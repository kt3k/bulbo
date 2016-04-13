# bulbo v3.0.0 [![Build Status](https://travis-ci.org/kt3k/bulbo.svg?branch=master)](https://travis-ci.org/kt3k/bulbo) [![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master) <img width="70" align="right" src="https://kt3k.github.io/bulbo/media/logo.svg" />


[![npm bulbo](https://nodei.co/npm/bulbo.png?compact=true)](https://www.npmjs.com/package/bulbo)

> Streaming static site generator, based on gulp

# Install

```
npm install --save-dev bulbo
```

# Usage

First you need to set up `bulbofile.js` like the following.

```js
const asset = require('bulbo').asset

const through = require('through')
const browserify = require('browserify')
const frontMatter = require('gulp-front-matter')
const wrap = require('gulp-wrap')

// css
asset('source/**/*.css')

// js
asset('source/page/*.js')
.base('source')
.watch('source/**/*.js')
.build(src => src.pipe(through(function (file) {

  file.contents = browserify(file.path).bundle()
  this.queue(file)

})))

// html
asset('source/*.html')
.build(src => src
  .pipe(frontMatter())
  .pipe(wrap(data => fs.readFileSync('source/layouts/' + data.file.frontMatter.layout).toString())))

// others
asset(['source/**/*', '!source/**/*.{js,css,html,lodash}'])
```

And then `bulbo serve` command starts the server.

    $ bulbo serve
    Using bulbofile: /Users/kt3k/tmp/bulbo/demo/bulbofile.js
    bulbo serve
    Server started at: http://0.0.0.0:7100/
    See debug page is: http://0.0.0.0:7100/__bulbo__
    [22:17:41] All files ready

And the following builds all the given assets and saves them to `build/` directory.

    $ bulbo build
    Using bulbofile: /Users/kt3k/tmp/bulbo/demo/bulbofile.js
    bulbo build

# API

```js
const bulbo = require('bulbo')
```

## bulbo.asset(glob, opts)

- @param {String|String[]} glob The glob pattern(s)
- @param {Object} [opts] The options

This registers the glob pattern as the asset source.

Example:
```js
bulbo.asset('src/js/**/*.js')
```

You can also pass the option to asset globing.

Example:
```js
bulbo.asset('src/js/**/*.js', {read: false})
```

The above doesn't read actual file contents when being built. This is useful when you use the transform which doesn't require the file contents.

## bulbo.asset(...).base(path)

- @param {string} path The base path of the asset glob

This sets the base path of the asset glob.

The base path is automatically chosen from your glob pattern. If you want change the default base path you can change it calling this method.

Example:
```js
bulbo.asset('src/img/**/*.*') // `src/img/foo.png` is copied to `build/foo.png` because the base path of this glob is `src/img` by default.

bulbo.asset('src/img/**/*.*').base('src') // but in this case, copied to `build/img/foo.png`
```

## bulbo.asset(...).watch(glob)

- @param {string|string[]} glob The path(s) to watch

This sets the watch path(s) of the asset. If no watch paths are set, the bulbo watches the same paths as the asset's source paths.

Example:
```js
bulbo
.asset('src/js/pages/*.js')
.watch('src/js/**/*.js') // Watches all js files under `src/js`, though build entry poits are only js files under `src/js/pages`.
.build(src => src.pipe(through(function(file) {

  file.contents = browserify(file.path).bundle()

  this.queue(file)

})))
```

## bulbo.asset(...).watchOptions(opts)

- @param {object} opts The options to pass to chokidar (the watcher library)

This options is passed to chokidar's watch option. You can modify the behaviour of the internal chokidar as you want.

## bulbo.asset(...).build(transform)

- @param {Function} transform The asset transform

This registers the build transform for the asset. The transform takes file (`vinyl`) stream as the first paramter and have to return a transformed stream as its output. It throws exception if the transform does not return a readable stream.

The source of the transform is compatible with gulp's `gulp.src(...)`. You can use pipe it to gulp plugins to transform it.

Example:
```js
bulbo
.asset('src/js/**/*.js')
.build(src => src.pipe(through(function (file) {

  file.contents = browserify(file.path).bundle()

  this.queue(file)

})))
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

The bulbo server has builtin debug url at `0.0.0.0:7100/__bulbo__`. You can find there all the available paths (assets) on the server. It's useful for debugging the asset stream.

![](https://kt3k.github.io/bulbo/media/ss.png)

# Recipes

## Use es6 in bulbofile

You can enable es2015 syntax by renaming `bulbofile.js` to `bulbofile.babel.js` and adding `babel-register` as dependency.

    npm install --save-dev babel-register babel-preset-es2015

You also need to set up `.babelrc` as follows:

```json
{
  "presets": [
    "es2015"
  ]
}
```

## Use CoffeeScript in bulbofile

You need to rename bulbofile.js to bulbofile.coffee and install coffeescript dependency:

    npm install --save-dev coffee-script

And your bulbofile.coffee looks like the following:

```coffee
asset = require('bulbo').asset

through = require 'through'
browserify = require 'browserify'
frontMatter = require 'gulp-front-matter'
wrap = require 'gulp-wrap'

asset 'source/**/*.css'

asset 'source/page/*.js'
.watch 'source/**/*.js'
.build (src) =>

  src.pipe through (file) ->

    file.contents = browserify(file.path).bundle()
    @queue file

asset 'source/*.html'
.build (src) =>
  src
  .pipe frontMatter()
  .pipe wrap (data) =>
    fs.readFileSync("source/layouts/#{ data.file.frontMatter.layout }").toString()

asset [
  'source/**/*'
  '!source/**/*.{js,css,html,lodash}'
]
```

## Uglify scripts only when it's production build

Use `gulp-if`:

```js
import gulpif from 'gulp-if'
import uglify from 'gulp-uglify'

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.build(src => src.pipe(gulpif(PRODUCTION_BUILD, uglify()))
```

This uglifies the scripts only when the variable NODE_ENV is `'production'`.

Or alternatively use `through`:

```js
import through from 'through'
import uglify from 'gulp-uglify'

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.build(src => src.pipe(PRODUCTION_BUILD ? uglify() : through()))
```

## Want to render my contents with template engine *XXXX*

Use `gulp-wrap` and the `engine` option:

```js
import wrap from 'gulp-wrap'
import frontMatter from 'gulp-front-matter'

asset('source/**/*.html')
.build(src => src
  .pipe(frontMatter())
  .pipe(wrap({src: 'source/layout.nunjucks'}, null, {engine: 'nunjucks'})))
```
***Note*** You need to `npm install nunjucks` in this case.

This example wraps your html in the nunjucks template. The contents of each html file is refereced by `contents` and the front matter by `file.frontMatter`.

## Watch different paths from source path.

Use `watch` option in the asset options.

```js
asset('source/page/*.js')
.watch('source/**/*.js')
```

This is useful when the entrypoints of the asset and the actual source files are different. For example, if you use browserify to bunble your scripts, your entrypoints are bundle's entrypoint files but you need to watch all of your source files which form the bundles.

# License

MIT

# Release history

- 2016-04-13   v3.0.0   Update DSL.
- 2016-01-09   v1.0.2   Improved server start time.
- 2016-01-08   v1.0.1   Fixed build file number limit bug.
- 2016-01-03   v1.0.0   Initial release.
