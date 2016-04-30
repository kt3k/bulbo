# bulbo v5.1.1 [![Build Status](https://travis-ci.org/kt3k/bulbo.svg?branch=master)](https://travis-ci.org/kt3k/bulbo) [![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master) <img width="70" align="right" src="https://kt3k.github.io/bulbo/media/logo.svg" />


[![npm bulbo](https://nodei.co/npm/bulbo.png?compact=true)](https://www.npmjs.com/package/bulbo)

> :tropical_drink: Gulp compatible static site generator

# Features

- **Compatible with gulp plugins** - you can use any gulp plugins in bulbo
- **Server and Watcher included** - you don't need to set up a dev server, bulbo does it for you
- **Flexible** - bulbo doesn't assume any directory structure, you can configure anything
- **Easy syntax** - see the getting started guide

# Install

    npm install --save-dev bulbo

# Getting started

First you need to set up `bulbofile.js` like the following.

```js
const bulbo = require('bulbo')
const asset = bulbo.asset

// copy css
asset('source/**/*.css')
```

The above means that `'source/**/*.css'` is asset and which will be copied to the destination directory (default: `build`).

## Change destination

If you want to change the destination you can do it with `bulbo.dest` method

```js
bulbo.dest('output')
```

## Browserify

If you need to bundle your scripts with `browserify` you can set up it like the following:

```js
const through2 = require('through2')
const browserify = require('browserify')

// build js
asset('source/page/*.js')
.base('source')
.watch('source/**/*.js')
.pipe(through2.obj((file, enc, callback) => {

  file.contents = browserify(file.path).bundle()
  callback(null, file)

}))
```

- `.base('source')` means the base path of your glob pattern (`source/page/*.js`) is `source`.
- `.watch('source/**/*.js')` means that this build process watches the files `source/**/*.js`, not only `source/page/*.js`
- `.pipe(through2.obj(...))` means this build process applies the browserify bundling to its file stream.
  - This transform is the same thing as you need to transform the gulp.src() stream.
  - You can use any gulp plugins here.

## Building html from layout and page source

To build html from layout tempate, set up it like the following:

```js
const frontMatter = require('gulp-front-matter')
const wrap = require('gulp-wrap')

// html
asset('source/*.html')
.pipe(frontMatter())
.pipe(wrap(data => fs.readFileSync('source/layouts/' + data.file.frontMatter.layout).toString())))
```

- `.pipe(frontMatter())` means it extracts the frontmatter from the file.
- `.pipe(wrap(...))` means it renders its html using layour file under the `source/layouts/`.
  - The layout file name is specified by `layout` property of the frontmatter.

## Excluding some patterns

To exclude some patterns, use `!` operator.

```js
// others
asset('source/**/*', '!source/**/*.{js,css,html,lodash}')
```

The above copies all assets under `source` except `.js`, `.css`, `.html` or `.lodash` files.


The resulting `bulbofile.js` looks like the following:

```js
const bulbo = require('bulbo')
const asset = bulbo.asset

const through2 = require('through2')
const browserify = require('browserify')
const frontMatter = require('gulp-front-matter')
const wrap = require('gulp-wrap')

bulbo.dest('output')

// css
asset('source/**/*.css')

// js
asset('source/page/*.js')
.base('source')
.watch('source/**/*.js')
.pipe(through2.obj((file, enc, callback) => {

  file.contents = browserify(file.path).bundle()
  callback(null, file)

}))

// html
asset('source/*.html')
.pipe(frontMatter())
.pipe(wrap(data => fs.readFileSync('source/layouts/' + data.file.frontMatter.layout).toString())))

// others
asset('source/**/*', '!source/**/*.{js,css,html,lodash}')
```

And then `bulbo serve` command starts the server.

    $ bulbo serve
    bulbo [01:33:38] Using: /Users/kt3k/tmp/long-dream-core/bulbofile.js
    bulbo [01:33:39] serving
    bulbo [01:33:39] Reading files: site/**/*.js
    bulbo [01:33:39] Reading files: src/infrastructure/infrastructure.js
    bulbo [01:33:39] Reading files: site/*.html
    bulbo [01:33:39] Reading files: site/data/**/*.*
    bulbo [01:33:39] Reading files: site/img/**/*.*
    bulbo [01:33:39] Reading files: site/css/**/*.*
    bulbo [01:33:39] Server started at: http://0.0.0.0:7100/
    bulbo [01:33:39] See debug page is: http://0.0.0.0:7100/__bulbo__
    bulbo [01:33:39] ✅ Files ready: site/**/*.js
    bulbo [01:33:39] ✅ Files ready: src/infrastructure/infrastructure.js
    bulbo [01:33:39] ✅ Files ready: site/*.html
    bulbo [01:33:39] ✅ Files ready: site/img/**/*.*
    bulbo [01:33:39] ✅ Files ready: site/css/**/*.*
    bulbo [01:33:39] ✅ Files ready: site/data/**/*.*

And the following builds all the given assets and saves them to `build/` directory.

    $ bulbo build
    bulbo [12:04:19] Using: /Users/kt3k/tmp/long-dream-core/bulbofile.js
    bulbo [12:04:20] building
    bulbo [12:04:25] done

# API reference

```js
const bulbo = require('bulbo')
```

## bulbo.asset(...paths)

- @param {string[]} paths The glob pattern(s)

This registers the glob pattern as the asset source.

Example:
```js
bulbo.asset('src/js/**/*.js')
```

Example:
```js
bulbo.asset('src/feature1/*.html', 'src/feature2/*.html')
```

## bulbo.asset().assetOptions(opts)

- @param {Object} [opts] The options

This passes the option to asset globing.

Example:
```js
bulbo.asset('src/js/**/*.js')
.assetOptions({read: false})
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
.pipe(through2.obj((file, enc, callback) => {

  file.contents = browserify(file.path).bundle()
  callback(null, file)

}))
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
.build(src => src.pipe(through2.obj((file, enc, callback) => {

  file.contents = browserify(file.path).bundle()
  callback(null, file)

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

through2 = require 'through2'
browserify = require 'browserify'
frontMatter = require 'gulp-front-matter'
wrap = require 'gulp-wrap'

asset 'source/**/*.css'
asset 'source/**/*'
asset '!source/**/*.{js,css,html,lodash}'

asset 'source/page/*.js'
.watch 'source/**/*.js'
.pipe through2.obj (file, enc, callback) ->

  file.contents = browserify(file.path).bundle()
  callback null, file

asset 'source/*.html'
.pipe frontMatter()
.pipe wrap (data) =>
  fs.readFileSync("source/layouts/#{ data.file.frontMatter.layout }").toString()
```

## Uglify scripts only when it's production build

Use `gulp-if`:

```js
import gulpif from 'gulp-if'
import uglify from 'gulp-uglify'

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.pipe(gulpif(PRODUCTION_BUILD, uglify())
```

This uglifies the scripts only when the variable NODE_ENV is `'production'`.

Or alternatively use `through2`:

```js
import through2 from 'through2'
import uglify from 'gulp-uglify'

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.pipe(PRODUCTION_BUILD ? uglify() : through2.obj())
```

## Want to render my contents with template engine *XXXX*

Use `gulp-wrap` and the `engine` option:

```js
import wrap from 'gulp-wrap'
import frontMatter from 'gulp-front-matter'

asset('source/**/*.html')
.pipe(frontMatter())
.pipe(wrap({src: 'source/layout.nunjucks'}, null, {engine: 'nunjucks'}))
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

- 2016-04-29   v5.1.1   Change the architecture. Use the same transform for an asset while watching.
- 2016-04-19   v4.2.3   Auto cloning feature of piped transform
- 2016-04-18   v4.1.0   Update vinyl-serve to v2.0.0 (fixed bug of serving data)
- 2016-04-17   v4.0.3   Update vinyl-serve to v1.3.4 (fixed bug of binary data handling)
- 2016-04-16   v4.0.2   Fix loading bug.
- 2016-04-14   v4.0.0   Update DSL.
- 2016-04-13   v3.0.0   Update DSL.
- 2016-01-09   v1.0.2   Improved server start time.
- 2016-01-08   v1.0.1   Fixed build file number limit bug.
- 2016-01-03   v1.0.0   Initial release.

# Dev info

## Architecture

Bulbo = `vinyl-fs` + `js-liftoff` + `stream-splicer` + `vinyl-serve` + Bulbo DSL

- `vinyl-fs` is the same as `gulp.src()` and `gulp.dest()`. Bulbo uses it for creating file streams and saving them.
- `js-liftoff` is a magical tool for creating CLI tool which is configurable by its DSL script, in this case like bulbofile.js.
- `stream-splicer` is used for creating a linear pipeline of transforms of the assets.
- `vinyl-serve` is a simple server which consumes readable vinyl streams and serves the files in them.

## Model

Bulbo has the only one model `Asset` which represents a group of assets and its transform.

## Application layer

Bulbo has 3 application layer classes, `AssetServer` `AssetBuilder` and `AssetService`

## Bulbo DSL

Bulbo DSL is implemented in `bulbo.js` (the module interface) and `AssetFacade` class.
