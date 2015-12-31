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
     * @param {String} dest The destitnation
     */
    pt.setDest = function (dest) {

        this.dest = dest

    }

    /**
     * Builds the assets
     *
     * @return {Stream}
     */
    pt.build = function () {

        return this.assets.getMergedStream().pipe(vfs.dest(this.dest))

    }

})

module.exports = AssetBuilder
