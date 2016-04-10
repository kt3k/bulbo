'use strict'

var AssetService = require('./AssetService')

var DEFAULT_DEST = 'build' // The default destination
var DEFAULT_PORT = 7100 // The default port number

var service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

/**
 * The module interface.
 */
var bulbo = {

    /**
     * Sets the asset and returns the static modifier setter for the asset.
     *
     * @param {String|String[]} glob The glob pattern
     * @param {Object} opts The options
     * @return {Function}
     */
    asset: function (glob, opts) {

        var asset = bulbo.getService().registerAsset(glob, opts)

        return asset.getModifierSetter()

    },

    /**
     * Gets the asset service.
     *
     * @return {AssetService}
     */
    getService: function () {

        return service

    },

    /**
     * Serves the assets at localhost.
     *
     * @internal
     * @param {Function} cb The callback
     */
    serve: function (cb) {

        bulbo.getService().serve(cb)

    },

    /**
     * Builds the assets to the destination.
     *
     * @param {Function} cb The callback
     * @internal
     */
    build: function (cb) {

        bulbo.getService().build(cb)

    },

    /**
     * Sets the dest.
     *
     * @param {String} dest The destination
     */
    dest: function (dest) {

        bulbo.getService().setDest(dest)

    },

    /**
     * Sets the port number.
     *
     * @param {Number} port The port number
     */
    port: function (port) {

        bulbo.getService().setPort(port)

    },

    /**
     * Returns if the assets are empty.
     *
     * @return {Boolean}
     */
    isEmpty: function () {

        return bulbo.getService().isEmpty()

    },

    /**
     * Clears all the assets.
     */
    clear: function () {

        bulbo.getService().clear()

    }

}

module.exports = bulbo
