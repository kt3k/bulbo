'use strict'

var chokidar = require('chokidar')

module.exports = function (glob, opts, cb) {

    return chokidar.watch(glob, opts)
        .on('unlink', cb)
        .on('change', cb)
        .on('add', cb)

}
