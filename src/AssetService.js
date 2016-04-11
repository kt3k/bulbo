'use strict'

var subclass = require('subclassjs')

var Asset = require('./Asset')
var AssetCollection = require('./AssetCollection')
var AssetServer = require('./AssetServer')
var AssetBuilder = require('./AssetBuilder')

/**
 * AssetService builds and serves the given assets.
 */
var AssetService = subclass(function (pt) {

    /**
     * @param {String} dest The destination
     * @param {Number} port The port number
     */
    pt.constructor = function (dest, port) {

        this.assets = new AssetCollection()
        this.dest = dest
        this.port = port

    }

    /**
     * Adds the asset
     *
     * @private
     * @param {Asset} asset The asset
     */
    pt.addAsset = function (asset) {

        this.assets.add(asset)

    }

    /**
     * Registers an asset by the given glob and options.
     *
     * @param {String|String[]} glob The glob pattern(s)
     * @param {Object} opts The options
     * @return {Asset}
     */
    pt.registerAsset = function (glob, opts) {

        var asset = new Asset(glob, opts)

        this.addAsset(asset)

        return asset

    }

    /**
     * Serves the assets.
     *
     * @param {Function} cb The callback
     */
    pt.serve = function (cb) {

        new AssetServer(this.assets, this.port).serve(cb)

    }

    /**
     * Builds the assets.
     *
     * @param {Function} cb The callback
     */
    pt.build = function (cb) {

        new AssetBuilder(this.assets, this.dest).build(cb)

    }

    /**
     * Sets the port number.
     *
     * @param {Number} port The port number
     */
    pt.setPort = function (port) {

        this.port = port

    }

    /**
     * Sets the destination.
     *
     * @param {String} dest The destination of the build
     */
    pt.setDest = function (dest) {

        this.dest = dest

    }

    /**
     * Returns if the assets are empty.
     *
     * @return {Boolean}
     */
    pt.isEmpty = function () {

        return this.assets.isEmpty()

    }

    /**
     * Clears all the assets.
     */
    pt.clear = function () {

        this.assets.empty()

    }

})

module.exports = AssetService
