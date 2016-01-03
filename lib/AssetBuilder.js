'use strict'

var subclass = require('subclassjs')
var vfs = require('vinyl-fs')

var AssetBuilder = subclass(function (pt) {

    /**
     * @constructor
     * @param {AssetCollection} assets The assets
     * @param {String} dest The destination
     */
    pt.constructor = function (assets, dest) {

        this.assets = assets
        this.dest = dest

    }

    /**
     * Builds the assets
     *
     * @param {Function} cb The callback
     * @return {Stream}
     */
    pt.build = function (cb) {

        var stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest))

        if (typeof cb === 'function') {

            stream
                .on('finish', function () { cb(null) })
                .on('error', function (e) { cb(e) })

        }

        return stream

    }

})

module.exports = AssetBuilder
