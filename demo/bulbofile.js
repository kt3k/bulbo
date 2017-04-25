var asset = require('../').asset
var loggerTitle = require('../').loggerTitle
var through2 = require('through2')
var browserify = require('browserify')

asset('../test/fixture/**/*.js')
.pipe(through2.obj((file, enc, cb) => browserify(file.path).bundle((err, contents) => {
  if (err) cb(err)

  file.contents = contents

  setTimeout(() => {
    cb(null, file)
  }, 5)
})))

asset('../test/fixture/**/*.css')

loggerTitle('myapp')
