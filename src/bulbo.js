import Asset from './domain/asset'
import AssetService from './app/asset-service'
import AssetFacade from './asset-facade'

const liftoff = require('./util/liftoff')

const DEFAULT_DEST = 'build' // The default destination
const DEFAULT_PORT = 7100 // The default port number

const service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

/**
 * Sets the asset and returns the static modifier setter for the asset.
 *
 * DSL vocabulary.
 *
 * @param {Array<string|string[]>} paths The paths of the asset
 * @return {Function}
 */
exports.asset = (...paths) => {
  const asset = new Asset(...paths)

  service.addAsset(asset)

  return new AssetFacade(asset)
}

/**
 * Gets the asset service.
 *
 * For internal use only.
 * @private
 * @return {AssetService}
 */
exports.getService = () => service

/**
 * Serves the assets at localhost.
 *
 * For internal use only.
 * @return {Promise}
 */
exports.serve = () => service.serve()

/**
 * Builds the assets to the destination.
 *
 * For internal use only.
 * @return {Promise}
 */
exports.build = () => service.build()

/**
 * Watches and builds the assets.
 *
 * For internal use only.
 */
exports.watchAndBuild = () => service.watchAndBuild()

/**
 * Sets the dest.
 *
 * DSL vocabulary.
 *
 * @param {String} dest The destination
 */
exports.dest = dest => service.setDest(dest)

/**
 * Sets the port number.
 *
 * DSL vocabulary.
 *
 * @param {Number} port The port number
 */
exports.port = port => service.setPort(port)

/**
 * Returns if the assets are empty.
 *
 * For internal use only.
 *
 * @return {Boolean}
 */
exports.isEmpty = () => service.isEmpty()

/**
 * Sets the logger.
 * @param {Logger} logger The logger
 */
exports.setLogger = logger => service.setLogger(logger)

/**
 * Clears all the assets.
 *
 * For internal use only.
 */
exports.clear = () => service.clear()

exports.cli = {liftoff}
