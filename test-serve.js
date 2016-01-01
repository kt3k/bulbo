var bulbo = require('./')
var through = require('through')
var browserify = require('browserify')

var asset = bulbo.asset
var dest = bulbo.dest

asset('test/fixture/**/*.css')

asset('test/fixture/**/*.js')(function (src) {

    return src.pipe(through(function (file) {

        file.contents = browserify(file.path).bundle()

        this.queue(file)

    }))

})

bulbo.serve()
