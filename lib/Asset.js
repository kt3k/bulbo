'use strict'

var subclass = require('subclassjs')
var vfs = require('vinyl-fs')
var id = function (x) { return x }

/**
 * The model of asset
 */
var Asset = subclass(function (pt) {

    /**
     * @constructor
     * @param {String|String[]} glob The glob pattern
     * @param {Object} opts The options to vinyl-fs#src
     */
    pt.constructor = function (glob, opts) {

        this.glob = glob
        this.opts = opts
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
     */
    pt.getStream = function () {

        return this.modifier(vfs.src(this.glob, this.opts))

    }

})

module.exports = Asset
