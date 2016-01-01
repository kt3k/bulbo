'use strict'

var watch = require('./watch')
var subclass = require('subclassjs')
var vinylServe = require('vinyl-serve')

vinylServe.setDebugPageTitle('Welcome to <i>Bulbo</i> asset path debug page!')

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
     * Serves, watching paths for assets.
     */
    pt.serve = function () {

        var self = this

        this.assets.forEach(function (asset) {

            watch(asset.getWatchPath(), asset.getWatchOpts(), function () {

                asset.pipe(vinylServe(self.port))

            })

        })

    }

})

module.exports = AssetServer
