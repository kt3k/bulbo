'use strict'

var Asset = require('./Asset')
var TaskManager = require('./TaskManager')

var DEFAULT_DEST = 'build' // The default destination
var DEFAULT_PORT = 7100 // The default port number

var taskMgr = new TaskManager(DEFAULT_DEST, DEFAULT_PORT)

/**
 * Sets the asset.
 *
 * @param {String|String[]} glob The glob pattern
 * @param {Object} opts The options
 */
var asset = function (glob, opts) {

    var asset = new Asset(glob, opts)

    taskMgr.addAsset(asset)

    return asset.getModifierSetter()

}

/**
 * Serves the assets at localhost.
 */
var serve = function () {

    taskMgr.serve()

}

/**
 * Builds the assets to the destination.
 */
var build = function () {

    taskMgr.build()

}

/**
 * Sets the dest.
 *
 * @param {String} dest The destination
 */
var dest = function (dest) {

    taskMgr.setDest(dest)

}

/**
 * Sets the port number.
 *
 * @param {Number} port The port number
 */
var port = function (port) {

    taskMgr.setPort(port)

}

/**
 * Returns if the assets are empty.
 *
 * @return {Boolean}
 */
var isEmpty = function () {

    return taskMgr.isEmpty()

}

module.exports = {

    asset: asset,
    dest: dest,
    port: port,
    serve: serve,
    build: build,
    isEmpty: isEmpty

}
