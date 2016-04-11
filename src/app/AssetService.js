import Asset from '../domain/Asset'
import AssetCollection from '../domain/AssetCollection'
import AssetServer from './AssetServer'
import AssetBuilder from './AssetBuilder'

/**
 * AssetService builds and serves the given assets.
 */
export default class AssetService {

    /**
     * @param {String} dest The destination
     * @param {Number} port The port number
     */
    constructor(dest, port) {

        this.assets = new AssetCollection()
        this.dest = dest
        this.port = port

    }

    /**
     * Adds the asset
     *
     * @private
     * @param {Asset} asset The asset
     */
    addAsset(asset) {

        this.assets.add(asset)

    }

    /**
     * Registers an asset by the given glob and options.
     *
     * @param {String|String[]} glob The glob pattern(s)
     * @param {Object} opts The options
     * @return {Asset}
     */
    registerAsset(glob, opts) {

        const asset = new Asset(glob, opts)

        this.addAsset(asset)

        return asset

    }

    /**
     * Serves the assets.
     *
     * @param {Function} cb The callback
     */
    serve(cb) {

        new AssetServer(this.assets, this.port).serve(cb)

    }

    /**
     * Builds the assets.
     * @param {Function} cb The callback
     */
    build(cb) {

        new AssetBuilder(this.assets, this.dest).build(cb)

    }

    /**
     * Sets the port number.
     * @param {Number} port The port number
     */
    setPort(port) {

        this.port = port

    }

    /**
     * Sets the destination.
     * @param {String} dest The destination of the build
     */
    setDest(dest) {

        this.dest = dest

    }

    /**
     * Returns if the assets are empty.
     * @return {Boolean}
     */
    isEmpty() {

        return this.assets.isEmpty()

    }

    /**
     * Clears all the assets.
     */
    clear() {

        this.assets.empty()

    }

}
