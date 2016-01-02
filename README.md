# bulbo v0.1.2 (WIP)

> Stream oriented static site generator, based on gulp ecosystem

# Install

```
npm install bulbo
```

# Usage

First you need to set up `bulbofile.js`. The example settings are like the following.

```js
import * from 'bulbo'

import through from 'through'
import browserify from 'browserify'

asset('source/**/*.js', {read: false})(src =>
  src.pipe(through(function (file) {
    file.contents = browserify(file.path).bundle()
    this.queue(file)
  })))

asset('source/**/*.css')

asset('source/**/*.ejs')(src => src.pipe(frontmatter()))

asset(['source/**/*', '!source/**/*.{js,css,ejs}'])

dest('/build')
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
