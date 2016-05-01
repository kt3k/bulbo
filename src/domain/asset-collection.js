import mergeStream from '../util/mergeStream'

/**
 * The collection class of assets.
 */
export default class AssetCollection {

    /**
     * @constructor
     */
    constructor() {

        this.assets = []

    }

    /**
     * Adds the asset.
     * @param {Asset} asset The asset
     */
    add(asset) {

        this.assets.push(asset)

    }

    /**
     * Gets the merged readable stream of assets.
     * @return {Stream}
     */
    getMergedStream() {

        return mergeStream(this.assets.map(asset => asset.getStream()))

    }

    /**
     * Pipes the duplex to the end of the all the assets.
     * @param {Duplex} duplex The duplex
     */
    pipeAll(duplex) {

        this.forEach(asset => asset.addPipe(duplex))

    }

    /**
     * Returns the promise which resolves when all the assets are ready.
     */
    isAllReady() {

        return Promise.all(this.assets.map(asset => asset.isReady()))

    }

    /**
     * Invokes the callback for each item with the given context.
     * @param {Function} cb The callback
     * @param {Object} ctx The this context
     */
    forEach(cb, ctx) {

        this.assets.forEach(cb, ctx)

    }

    /**
     * Returns if the assets are empty.
     * @return {Boolean}
     */
    isEmpty() {

        return this.assets.length === 0

    }

    /**
     * Empties the assets list.
     */
    empty() {

        this.assets.splice(0)

    }

    /**
     * Reflows the source in all the assets.
     * @param {object} options The options
     */
    reflowAll(options, cb) {

        this.forEach(asset => asset.reflow(options, () => cb ? cb(null, asset) : null))

    }

}
