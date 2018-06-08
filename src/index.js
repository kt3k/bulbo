const Asset = require('./domain/asset')
const AssetService = require('./app/asset-service')
const AssetFacade = require('./asset-facade')
const vinylServe = require('vinyl-serve')

const liftoff = require('./util/liftoff')

const service = new AssetService()

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
 * Sets the default of the asset's base path.
 * @param {string} base The default base path
 */
exports.base = base => service.setAssetBasePath(base)

/**
 * Sets the port number.
 * @param {Number} port The port number
 */
exports.port = port => service.setPort(port)

/**
 * Sets the debug page title.
 * @param {string} debugPageTitle
 */
exports.debugPageTitle = debugPageTitle =>
  service.setDebugPageTitle(debugPageTitle)

/**
 * Sets the debug page path.
 * @param {string} debugPagePath
 */
exports.debugPagePath = debugPagePath =>
  service.setDebugPagePath(debugPagePath)

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
 * Unwatches the assets.
 */
exports.unwatch = () => service.unwatch()

/**
 * Returns true iff the assets are empty.
 * @return {Boolean}
 */
exports.isEmpty = () => service.isEmpty()

/**
 * Sets the logger title.
 * @param {string} name The logger title
 */
exports.loggerTitle = title =>
  service.setLogger(require('./util/logger')(title))

// -- Private API -- //
// These are used in tests.

/**
 * Sets the logger. Private API.
 * @param {Logger} logger The logger
 */
exports.setLogger = logger => service.setLogger(logger)

/**
 * Clears all the assets. Private API.
 * @private
 */
exports.clear = () => service.clear()

/**
 * Adds the connect middleware.
 * @param {Function} middleware
 */
exports.addMiddleware = middleware => {
  vinylServe.addMiddleware(middleware)
}

exports.cli = { liftoff }
