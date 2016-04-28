var asset = require('../').asset
var through2 = require('through2')
var browserify = require('browserify')

asset('../spec/fixture/**/*.js').build(function (src) {

    return src.pipe(through2.obj((file, enc, cb) => browserify(file.path).bundle((err, contents) => {

        file.contents = contents

        setTimeout(() => {
            cb(null, file)
        }, 5)

    })))

})

asset('../spec/fixture/**/*.css')
