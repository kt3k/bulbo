'use strict'

var vfs = require('vinyl-fs')
var subclass = require('subclassjs')
var vinylServe = require('vinylServe')

var AssetServer = subclass(function (pt) {

    /**
     * @param {AssetCollection} assets The assets
     * @param {Number} port The port number
     */
    pt.constructor = function (assets, port) {

        this.assets = assets
        this.port = port

    }

    /**
     * Starts the server, watching paths for assets.
     */
    pt.start = function () {

        this.assets.forEach(function (asset) {

            vfs.watch(asset.getWatchPath(), null, function () {

                asset.pipe(vinylServe(this.port))

            }.bind(this))

        }, this)

    }

})

module.exports = AssetServer
