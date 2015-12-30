# bulbo v0.1.0 (WIP)

> Stream oriented static site generator, based on gulp ecosystem

# Install

```
npm install bulbo
```

# `bulbofile.js`

```
import * from 'bulbo'

asset('m/**/*.js', {read: false})(src => src
  .pipe($.tap(function (file) {
    file.contents = browserify(file.path).bundle()
  })))

asset('m/**/*.css')

asset('m/**/*.ejs')(src => src.pipe(frontmatter()))

asset(['m/**/*', '!m/**/*.{js,css,ejs}'])

dest('/p')
```


