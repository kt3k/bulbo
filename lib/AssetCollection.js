'use strict'

var subclass = require('subclassjs')
var mergeStream = require('./mergeStream')

/**
 * The collection class of assets.
 *
 * @class
 */
var AssetCollection = subclass(function (pt) {

    /**
     * @constructor
     */
    pt.constructor = function () {

        this.assets = []

    }

    /**
     * Adds the asset.
     *
     * @param {Asset} asset The asset
     */
    pt.add = function (asset) {

        this.assets.push(asset)

    }

    /**
     * Gets the merged stream of assets.
     *
     * @return {Stream}
     */
    pt.getMergedStream = function () {

        return mergeStream(this.assets.map(function (asset) {

            return asset.getStream()

        }))

    }

    /**
     * forEach
     *
     * @param {Function} cb The callback
     * @param {Object} ctx The this context
     */
    pt.forEach = function (cb, ctx) {

        this.assets.forEach(cb, ctx)

    }

    /**
     * Returns if the assets are empty.
     *
     * @param {Boolean}
     */
    pt.isEmpty = function () {

        return this.assets.length === 0

    }

})

module.exports = AssetCollection
