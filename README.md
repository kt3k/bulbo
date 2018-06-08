# bulbo v7.0.0

> Generate your static site with gulp plugins!

<img width="100" src="https://kt3k.github.io/bulbo/media/logo.svg" />

[![CircleCI](https://circleci.com/gh/kt3k/bulbo.svg?style=svg)](https://circleci.com/gh/kt3k/bulbo)
[![Build status](https://ci.appveyor.com/api/projects/status/51xxba14ksrl1142?svg=true)](https://ci.appveyor.com/project/kt3k/bulbo)
[![codecov.io](https://codecov.io/github/kt3k/bulbo/coverage.svg?branch=master)](https://codecov.io/github/kt3k/bulbo?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/kt3k/bulbo.svg)](https://greenkeeper.io/)

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
const bundler = require('bundle-through')

// build js
asset('source/page/*.js')
.base('source')
.watch('source/**/*.js')
.pipe(bundler())
```

- `.base('source')` means the base path of your glob pattern (`source/page/*.js`) is `source`.
- `.watch('source/**/*.js')` means that this build process watches the files `source/**/*.js`, not only `source/page/*.js`
- `.pipe(bundler())` registers `bundler()` as the transform. `bundler()` transforms all files into the bundles using `browserify`. See [the document](https://github.com/kt3k/bundle-through) for details.

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

const bundler = require('bundle-through')
const frontMatter = require('gulp-front-matter')
const wrap = require('gulp-wrap')

bulbo.dest('output')

// css
asset('source/**/*.css')

// js
asset('source/page/*.js')
.base('source')
.watch('source/**/*.js')
.pipe(bundler())

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
    bulbo [01:33:39] Reading: site/**/*.js
    bulbo [01:33:39] Reading: src/infrastructure/infrastructure.js
    bulbo [01:33:39] Reading: site/*.html
    bulbo [01:33:39] Reading: site/data/**/*.*
    bulbo [01:33:39] Reading: site/img/**/*.*
    bulbo [01:33:39] Reading: site/css/**/*.*
    bulbo [01:33:39] Server started at: http://0.0.0.0:7100/
    bulbo [01:33:39] See debug page is: http://0.0.0.0:7100/__bulbo__
    bulbo [01:33:39] Ready: site/**/*.js
    bulbo [01:33:39] Ready: src/infrastructure/infrastructure.js
    bulbo [01:33:39] Ready: site/*.html
    bulbo [01:33:39] Ready: site/img/**/*.*
    bulbo [01:33:39] Ready: site/css/**/*.*
    bulbo [01:33:39] Ready: site/data/**/*.*

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

## bulbo.base(base)

- @param {string} base

This sets the default base path for all the assets.

Example:
```js
bulbo.base('source')

bulbo.asset('source/news/**/*.md')
bulbo.asset('source/events/**/*.md')

bulbo.dest('build')
```

The above assets build to `build/news/**/*.md` and `build/events/**/*.md` respectively.

## bulbo.loggerTitle(title)

- @param {string} title The title of the logger

This sets the logger title.

```js
bulbo.loggerTitle('myapp')
```

Then the console looks like the below:

    $ bulbo serve
    bulbo [21:22:38] Using: /Users/kt3k/t/bulbo/demo/bulbofile.js
    myapp [21:22:38] serving
    myapp [21:22:38] Reading: ../test/fixture/**/*.js
    myapp [21:22:38] Reading: ../test/fixture/**/*.css
    myapp [21:22:38] Server started at: http://localhost:7100/
    myapp [21:22:38] See debug info at: http://localhost:7100/__bulbo__
    myapp [21:22:38] Ready: ../test/fixture/**/*.css
    myapp [21:22:44] Ready: ../test/fixture/**/*.js

## bulbo.addMiddleware(middleware)

- @param {Function} middleware

Adds the connect compiliant middleware to the server.

Example:

```js
const livereload = require('connect-livereload')

bulbo.addMiddleware(() => livereload())
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
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.pipe(gulpif(PRODUCTION_BUILD, uglify())
```

This uglifies the scripts only when the variable NODE_ENV is `'production'`.

Or alternatively use `through2`:

```js
const through2 = require('through2')
const uglify = require('gulp-uglify')

const PRODUCTION_BUILD = process.NODE_ENV === 'production'

asset('source/**/*.js')
.pipe(PRODUCTION_BUILD ? uglify() : through2.obj())
```

## Want to render my contents with template engine *XXXX*

Use `gulp-wrap` and the `engine` option:

```js
const wrap = require('gulp-wrap')
const frontMatter = require('gulp-front-matter')

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

# Extension API

`bulbo` can be used as internal engine of your own static site generator.

The example looks like the following:

index.js:

```js
const bulbo = require('bulbo')

bulbo.asset(...).pipe(...) // Some preset settings are here.

module.exports = bulbo
```

bin/index.js

```js
const bulbo = require('bulbo')

bulbo.cli.liftoff('mycommand', {configIsOptional: true}).then(bulbo => {
  bulbo.build()
})
```

and bin/index.js works as static site generator cli with some asset building preset.

   $ node bin/index.js

This builds preset assets without your configuration. This is useful if you want to share the same bulbo setting across the projects.

## bulbo.cli.liftoff(name, options)

- @param {string} name The command (module) name
- @param {object} options The options
- @param {boolean} [options.configIsOptional] True iff the config is optional. Default is false.
- @return {Promise}

This set up your module using `liftoff`. This returns a promise which is resolved by the your own module. Your module needs to implement `setLogger` method. It is recommended you expose bulbo module instance as your module interface.

This does not take care of cli options. It is recommended to use with option parsers like `minimist`, `minimisted` etc.

# License

MIT

# Release history

- 2018-06-09   v7.0.0   Add middleware support. Drop Node 4 support.
- 2017-04-26   v6.13.0  Update debug page design.
- 2017-04-26   v6.11.0  Add config extension types.
- 2017-04-26   v6.10.0  Update cli.liftoff util.
- 2017-04-25   v6.9.0   loggerTitle method.
- 2017-04-23   v6.8.0   Serve index.html.
- 2017-04-12   v6.7.0   Improve error logging.
- 2016-12-29   v6.5.0   Fix windows issues.
- 2016-12-28   v6.4.0   Update vinyl-serve.
- 2016-10-28   v6.3.0   Add base method.
- 2016-10-11   v6.2.4   Update minirocket.
- 2016-09-18   v6.2.1   Update vinyl-serve.
- 2016-09-05   v6.2.0   Add extension API.
- 2016-09-05   v6.1.5   Refactoring (use minirocket).
- 2016-05-08   v6.1.0   Better error handling.
- 2016-05-01   v6.0.0   Remove asset().build() DSL verb.
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
