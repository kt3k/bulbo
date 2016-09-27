'use strict'

const Asset = require('./domain/asset')
const AssetService = require('./app/asset-service')
const AssetFacade = require('./asset-facade')

const liftoff = require('./util/liftoff')

const DEFAULT_DEST = 'build' // The default destination
const DEFAULT_PORT = 7100 // The default port number

const service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

// -- DSL vocabularies -- //
// These are used in bulbofiles.

/**
 * Creates and registers an asset by the given paths and returns AssetFacade interface for further modification of asset building.
 * See the document of AssetFacade about what can be modified about the assets.
 * @param {Array<string|string[]>} paths The paths of the asset
 * @return {Function}
 */
exports.asset = (...paths) => {
  const asset = new Asset(...paths)

  service.addAsset(asset)

  return new AssetFacade(asset)
}

/**
 * Sets the dest.
 * @param {String} dest The destination
 */
exports.dest = dest => service.setDest(dest)

/**
 * Sets the port number.
 * @param {Number} port The port number
 */
exports.port = port => service.setPort(port)

/**
 * Sets the debug page title.
 * @param {string} debugPageTitle
 */
exports.debugPageTitle = debugPageTitle => service.setDebugPageTitle(debugPageTitle)

/**
 * Sets the debug page path.
 * @param {string} debugPagePath
 */
exports.debugPagePath = debugPagePath => service.setDebugPagePath(debugPagePath)

// -- API for CLI -- //
// These are used in CLIs.

/**
 * Serves the assets at localhost.
 * @return {Promise}
 */
exports.serve = () => service.serve()

/**
 * Builds the assets to the destination.
 * @return {Promise}
 */
exports.build = () => service.build()

/**
 * Watches and builds the assets.
 */
exports.watchAndBuild = () => service.watchAndBuild()

/**
 * Returns true iff the assets are empty.
 * @return {Boolean}
 */
exports.isEmpty = () => service.isEmpty()

/**
 * Sets the logger. Private API.
 * @param {Logger} logger The logger
 */
exports.setLogger = logger => service.setLogger(logger)

// -- Private API -- //
// These are used in tests.

/**
 * Gets the asset service. Private API.
 * @private
 * @return {AssetService}
 */
exports.getService = () => service

/**
 * Clears all the assets. Private API.
 * @private
 */
exports.clear = () => service.clear()

exports.cli = {liftoff}
