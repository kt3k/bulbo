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

})

module.exports = AssetCollection
