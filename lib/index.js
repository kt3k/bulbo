'use strict'

var AssetService = require('./AssetService')

var DEFAULT_DEST = 'build' // The default destination
var DEFAULT_PORT = 7100 // The default port number

var service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

var getService = function () { return service }

/**
 * The module interface.
 */
var bulbo = {

    /**
     * Sets the asset and returns the static modifier setter for the asset.
     *
     * DSL vocabulary.
     *
     * @param {String|String[]} glob The glob pattern
     * @param {Object} opts The options
     * @return {Function}
     */
    asset: function (glob, opts) {

        var asset = getService().registerAsset(glob, opts)

        return asset.getModifierSetter()

    },

    /**
     * Gets the asset service.
     *
     * For internal use.
     *
     * @private
     * @return {AssetService}
     */
    getService: function () {

        return getService()

    },

    /**
     * Serves the assets at localhost.
     *
     * For internal use.
     *
     * @param {Function} cb The callback
     */
    serve: function (cb) {

        getService().serve(cb)

    },

    /**
     * Builds the assets to the destination.
     *
     * For internal use.
     *
     * @param {Function} cb The callback
     */
    build: function (cb) {

        getService().build(cb)

    },

    /**
     * Sets the dest.
     *
     * DSL vocabulary.
     *
     * @param {String} dest The destination
     */
    dest: function (dest) {

        getService().setDest(dest)

    },

    /**
     * Sets the port number.
     *
     * DSL vocabulary.
     *
     * @param {Number} port The port number
     */
    port: function (port) {

        getService().setPort(port)

    },

    /**
     * Returns if the assets are empty.
     *
     * For internal use only.
     *
     * @return {Boolean}
     */
    isEmpty: function () {

        return getService().isEmpty()

    },

    /**
     * Clears all the assets.
     *
     * For internal use only.
     */
    clear: function () {

        getService().clear()

    }

}

module.exports = bulbo
