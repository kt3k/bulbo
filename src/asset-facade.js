import {Transform} from 'stream'
/**
 * The factory class of asset modifiers.
 */
export default class AssetFacade {

    /**
     * @param {Asset} asset The asset to modify
     */
    constructor(asset) {

        this.setAssetModel(asset)

    }

    setAssetModel(asset) {
        this.assetModel = asset
    }

    getAssetModel() {
        return this.assetModel
    }

    /**
     * Adds the asset paths.
     * @param {Array<string|string[]>} paths The paths
     */
    asset(...paths) {

        this.getAssetModel().addAssetPaths(...paths)

        return this

    }

    /**
     * Sets the asset options.
     * @param {object} opts The options to pass to the vinyl-fs
     */
    assetOptions(opts) {

        this.getAssetModel().setAssetOpts(opts)

        return this

    }

    /**
     * Sets the build function.
     * @param {Function} transform The build method takes a {@code Stream} and returns a {@code Stream}
     */
    build(transform) {

        this.getAssetModel().addTransform(transform)

        return this

    }

    /**
     * Sets the watch paths and opts.
     * @param {Array<string|string[]>} watchPaths The paths to watch
     */
    watch(...watchPaths) {

        this.getAssetModel().addWatchPaths(...watchPaths)

        return this

    }

    /**
     * Sets the watch options.
     * @param {object} options The watch options
     */
    watchOptions(options) {

        this.getAssetModel().setWatchOpts(options)

        return this

    }

    /**
     * Sets the base path.
     * @param {string} base The base path
     */
    base(base) {

        this.getAssetModel().setBase(base)

        return this

    }

    /**
     * Adds the trasform of transform stream.
     * @param {Transform} transform The transform to pass to the vinyl stream
     */
    pipe(transform) {

        AssetFacade.checkTransformCloneable(transform)

        this.getAssetModel().addTransform(src => src.pipe(AssetFacade.cloneTransform(transform)))

        return this

    }

    /**
     * @param {TransformStream} transform The transform stream
     */
    static cloneTransform(transform) {

        const clone = new Transform({objectMode: true})

        clone._transform = transform._transform
        clone._flush = transform._flush

        return clone

    }

    /**
     * Checks if the transform stream is cloneable. If not, throws.
     * @param {Transform} transform The transform stream
     * @throws {Error} when the transform is not cloneable
     */
    static checkTransformCloneable(transform) {

        if (!AssetFacade.isCloneableTransform(transform)) {

            throw new Error('The given transform stream does not confirm to Stream v2 TransformStream spec')

        }

    }

    /**
     * Checks if the object is a cloneable transform stream.
     * @param {Object} obj The object
     */
    static isCloneableTransform(obj) {

        return obj != null && typeof obj._transform === 'function'

    }

}
