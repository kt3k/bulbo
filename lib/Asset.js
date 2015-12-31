'use strict'

var subclass = require('subclassjs')
var vfs = require('vinyl-fs')
var Stream = require('stream').Stream

/**
 * identity function - default for stream modifier
 *
 * @param {Object} x any
 * @return {Object}
 */
var id = function (x) { return x }

/**
 * The model of asset
 */
var Asset = subclass(function (pt) {

    /**
     * @constructor
     * @param {String|String[]} glob The glob pattern
     * @param {Object} [opts] The options to vinyl-fs#src
     * @param {String|String[]} [opts.watch] The watch path
     */
    pt.constructor = function (glob, opts) {

        opts = opts || {}

        this.glob = glob
        this.opts = opts
        this.watchPath = opts.watch
        this.modifier = id

    }

    /**
     * Gets the static setter of the modifier.
     *
     * @return {Function}
     */
    pt.getModifierSetter = function () {

        var asset = this

        /**
         * Static setter of modifier
         *
         * @param {Function} modifier The modifier
         */
        return function (modifier) {

            asset.modifier = modifier

        }

    }

    /**
     *
     * @param {stream.Writable} writableStream The writable strem
     * @return {Stream}
     */
    pt.pipe = function (writableStream) {

        return this.getStream().pipe(writableStream)

    }

    /**
     * Gets the stream from source glob pattern and modified by the modfier.
     *
     * @return {Stream}
     * @throws {Error} When
     */
    pt.getStream = function () {

        var stream = this.modifier(vfs.src(this.glob, this.opts))

        if (!(stream instanceof Stream)) {

            throw new Error('Asset modifier must return a stream (asset path: [' + this.glob.toString() + '], modifier: ' + this.modifier + ')')

        }

        return stream

    }

    /**
     * @return {String|String[]}
     */
    pt.getWatchPath = function () {

        return this.watchPath

    }

})

module.exports = Asset
