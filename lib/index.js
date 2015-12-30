'use strict'

var Asset = require('./Asset')
var AssetCollection = require('./AssetCollection')
var assetCollection = new AssetCollection()

/**
 * Sets the asset.
 */
var asset = function (glob, opts) {

    var asset = new Asset(glob, opts)

    assetCollection.add(asset)

    return asset.getModifierSetter()

}

/**
 * Sets the dest.
 */
var dest = function (path) {
}

module.exports = {

    asset: asset,
    dest: dest

}
