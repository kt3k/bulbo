'use strict'

var AssetService = require('./AssetService')

var DEFAULT_DEST = 'build' // The default destination
var DEFAULT_PORT = 7100 // The default port number

var service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

var moduleIF = {
    /**
     * Sets the asset.
     *
     * @param {String|String[]} glob The glob pattern
     * @param {Object} opts The options
     */
    asset: function (glob, opts) {

        var asset = moduleIF.getService().registerAsset(glob, opts)

        return asset.getModifierSetter()

    },

    /**
     * Gets the asset service
     *
     * @internal
     */
    getService: function () {

        return service

    },

    /**
     * Serves the assets at localhost.
     *
     * @internal
     */
    serve: function () {

        moduleIF.getService().serve()

    },

    /**
     * Builds the assets to the destination.
     *
     * @internal
     */
    build: function () {

        moduleIF.getService().build()

    },

    /**
     * Sets the dest.
     *
     * @public
     * @param {String} dest The destination
     */
    dest: function (dest) {

        moduleIF.getService().setDest(dest)

    },

    /**
     * Sets the port number.
     *
     * @public
     * @param {Number} port The port number
     */
    port: function (port) {

        moduleIF.getService().setPort(port)

    },

    /**
     * Returns if the assets are empty.
     *
     * @internal
     * @return {Boolean}
     */
    isEmpty: function () {

        return moduleIF.getService().isEmpty()

    }

}

module.exports = moduleIF
