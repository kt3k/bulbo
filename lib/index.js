'use strict'

var Asset = require('./Asset')
var TaskManager = require('./TaskManager')

var DEFAULT_DEST = 'build/' // The default destination
var DEFAULT_PORT = 7100 // The default port number

var taskMgr = new TaskManager(DEFAULT_DEST, DEFAULT_PORT)

/**
 * Sets the asset.
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

module.exports = {

    asset: asset,
    dest: dest,
    port: port,
    serve: serve,
    build: build

}
