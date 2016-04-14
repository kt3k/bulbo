import Asset from './domain/Asset'
import AssetService from './app/AssetService'
import AssetModifier from './asset-facade'

const DEFAULT_DEST = 'build' // The default destination
const DEFAULT_PORT = 7100 // The default port number

const service = new AssetService(DEFAULT_DEST, DEFAULT_PORT)

/**
 * Sets the asset and returns the static modifier setter for the asset.
 *
 * DSL vocabulary.
 *
 * @param {String|String[]} glob The glob pattern
 * @param {Object} opts The options
 * @return {Function}
 */
export function asset(glob, opts) {

    const asset = new Asset(glob, opts)

    service.addAsset(asset)

    return new AssetModifier(asset)

}

/**
 * Gets the asset service.
 *
 * For internal use only.
 * @private
 * @return {AssetService}
 */
export const getService = () => service

/**
 * Serves the assets at localhost.
 *
 * For internal use only.
 * @return {Promise}
 */
export const serve = () => service.serve()

/**
 * Builds the assets to the destination.
 *
 * For internal use only.
 * @return {Promise}
 */
export const build = () => service.build()

/**
 * Sets the dest.
 *
 * DSL vocabulary.
 *
 * @param {String} dest The destination
 */
export const dest = dest => service.setDest(dest)

/**
 * Sets the port number.
 *
 * DSL vocabulary.
 *
 * @param {Number} port The port number
 */
export const port = port => service.setPort(port)

/**
 * Returns if the assets are empty.
 *
 * For internal use only.
 *
 * @return {Boolean}
 */
export const isEmpty = () => service.isEmpty()

/**
 * Clears all the assets.
 *
 * For internal use only.
 */
export const clear = () => service.clear()

/**
 * The module interface.
 */
export default {asset, getService, serve, build, dest, port, isEmpty, clear}
