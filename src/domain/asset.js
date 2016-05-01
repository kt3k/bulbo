import vfs from 'vinyl-fs'
import pipeline from '../util/pipeline'

/**
 * The model of asset
 */
export default class Asset {

    /**
     * @constructor
     * @param {Array<string|string[]>} paths The paths to build
     */
    constructor(...paths) {

        this.paths = []
        this.addAssetPaths(...paths)
        this.opts = {}
        this.watchPaths = []
        this.watchOpts = {}

        this.pipeline = pipeline.obj()

    }

    /**
     * Adds the asset paths.
     * @param {Array<string|string[]>} paths The paths to build
     */
    addAssetPaths(...paths) {

        this.paths = this.paths.concat(...paths)

    }

    /**
     * Sets the asset options.
     * @param {object} opts The asset options to pass to vinyl-fs when creating vinyl stream
     */
    setAssetOpts(opts) {

        Object.assign(this.opts, opts)

    }

    /**
     * Adds the watch paths.
     * @param {string|string[]} paths The paths
     */
    addWatchPaths(...paths) {

        this.watchPaths = this.watchPaths.concat(paths)

    }

    /**
     * @param {Transform}
     */
    addPipe(pipe) {

        this.pipeline.push(pipe)

    }

    /**
     * Sets the base path.
     * @param {string} base The base path of the assets
     */
    setBase(base) {

        this.opts.base = base

    }

    /**
     * Sets the watch opts.
     * @param {object} opts The watch opts
     */
    setWatchOpts(opts) {

        Object.assign(this.watchOpts, opts)

    }

    /**
     *
     * @param {Writable} writable The writable stream
     */
    pipe(writable) {

        this.pipeline.pipe(writable)

    }

    /**
     * Pours the source files into the transform stream.
     * @param {object} options The pipe options
     * @param {Function} cb The callback
     */
    reflow(options, cb) {

        this.getSourceStream().pipe(this.pipeline, options)

        if (cb) { this.pipeline.once('buffer-empty', cb) }

    }

    /**
     * Gets the source stream.
     * @return {Readable}
     */
    getSourceStream() {

        return vfs.src(this.paths, this.opts)

    }

    /**
     * Gets the readable end of the transform stream.
     * @return {Readable}
     */
    getStream() {

        return this.pipeline

    }

    /**
     * Gets the watch path(s).
     *
     * @return {String|String[]}
     */
    getWatchPaths() {

        return this.watchPaths.length > 0 ? this.watchPaths : this.paths

    }

    /**
     * Gets the watch opts.
     *
     * @return {Object}
     */
    getWatchOpts() {

        return this.watchOpts

    }

    /**
     * Returns a string expression
     */
    toString() {
        return this.paths.toString()
    }

}
