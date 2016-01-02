var asset = require('../').asset
var through = require('through')
var browserify = require('browserify')

asset('fixture/**/*.js')(function (src) {

    return src.pipe(through(function (file) {

        file.contents = browserify(file.path).bundle()

        this.queue(file)

    }))

})

asset('fixture/**/*.css')
