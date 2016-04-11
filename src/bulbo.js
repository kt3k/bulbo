import AssetService from './AssetService'

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

    const asset = service.registerAsset(glob, opts)

    return asset.getModifierSetter()

}

/**
 * Gets the asset service.
 *
 * For internal use only.
 *
 * @private
 * @return {AssetService}
 */
export function getService() {

    return service

}

/**
 * Serves the assets at localhost.
 *
 * For internal use.
 *
 * @param {Function} cb The callback
 */
export function serve(cb) {

    service.serve(cb)

}

/**
 * Builds the assets to the destination.
 *
 * For internal use.
 *
 * @param {Function} cb The callback
 */
export function build(cb) {

    service.build(cb)

}

/**
 * Sets the dest.
 *
 * DSL vocabulary.
 *
 * @param {String} dest The destination
 */
export function dest(dest) {

    service.setDest(dest)

}

/**
 * Sets the port number.
 *
 * DSL vocabulary.
 *
 * @param {Number} port The port number
 */
export function port(port) {

    service.setPort(port)

}

/**
 * Returns if the assets are empty.
 *
 * For internal use only.
 *
 * @return {Boolean}
 */
export function isEmpty() {

    return service.isEmpty()

}

/**
 * Clears all the assets.
 *
 * For internal use only.
 */
export function clear() {

    service.clear()

}

/**
 * The module interface.
 */
export default {asset, getService, serve, build, dest, port, isEmpty, clear}
