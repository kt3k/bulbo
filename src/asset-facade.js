/**
 * The factory class of asset modifiers.
 */
export default class AssetFacade {

    /**
     * @param {Asset} asset The asset to modify
     */
    constructor(asset) {

        this.asset = asset

    }

    /**
     * Adds the asset paths.
     * @param {Array<string|string[]>} paths The paths
     */
    asset(...paths) {

        this.asset.addAssetPaths(...paths)

        return this

    }

    /**
     * Sets the asset options.
     * @param {object} opts The options to pass to the vinyl-fs
     */
    assetOptions(opts) {

        this.asset.setAssetOpts(opts)

        return this

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
     * @param {Array<string|string[]>} watchPaths The paths to watch
     */
    watch(...watchPaths) {

        this.asset.addWatchPaths(...watchPaths)

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
