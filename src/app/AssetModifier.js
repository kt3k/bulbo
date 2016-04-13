/**
 * The factory class of asset modifiers.
 */
export default class AssetModifier {

    /**
     * @param {Asset} asset The asset to modify
     */
    constructor(asset) {

        this.asset = asset

    }

    /**
     * Sets the build function.
     * @param {Function} transform The build method takes a {@code Stream} and returns a {@code Stream}
     */
    build(transform) {

        this.asset.addTransform(transform)

        return this

    }

    /**
     * Sets the watch paths and opts.
     * @param {string|string[]}
     */
    watch(watchPaths) {

        this.asset.addWatchPaths(watchPaths)

        return this

    }

    /**
     * Sets the watch options.
     * @param {object} options The watch options
     */
    watchOptions(options) {

        this.asset.setWatchOpts(options)

        return this

    }

    /**
     * Sets the base path.
     * @param {string} base The base path
     */
    base(base) {

        this.asset.setBase(base)

        return this

    }

}
