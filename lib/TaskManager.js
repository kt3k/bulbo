'use strict'

var subclass = require('subclassjs')

var AssetCollection = require('./AssetCollection')
var AssetServer = require('./AssetServer')
var AssetBuilder = require('./AssetBuilder')

var TaskManager = subclass(function (pt) {

    /**
     * @param {AssetCollection} assets The assets
     * @param {String} dest The destination
     * @param {Number} port The port number
     */
    pt.constructor = function (dest, port) {

        this.assets = new AssetCollection()
        this.assetBuilder = new AssetBuilder(this.assets, dest)
        this.assetServer = new AssetServer(this.assets, port)

    }

    /**
     * Adds the asset
     *
     * @param {Asset} asset The asset
     */
    pt.addAsset = function (asset) {

        this.assets.add(asset)

    }

    /**
     * Serves the assets.
     */
    pt.serve = function () {

        this.assetServer.serve()

    }

    /**
     * Builds the assets.
     */
    pt.build = function () {

        this.assetBuilder.build()

    }

    /**
     * Sets the port number.
     *
     * @param {Number} port The port number
     */
    pt.setPort = function (port) {

        this.assetServer.setPort(port)

    }

    /**
     * Sets the destination.
     *
     * @param {String} dest The destination of the build
     */
    pt.setDest = function (dest) {

        this.assetBuilder.setDest(dest)

    }

    /**
     * Returns if the assets are empty.
     *
     * @return {Boolean}
     */
    pt.isEmpty = function () {

        return this.assets.isEmpty()

    }

})

module.exports = TaskManager
