import vfs from 'vinyl-fs'
import {Stream} from 'stream'

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
        this.transforms = []
        this.transformStream = null

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
     * Adds the transform
     */
    addTransform(transform) {

        this.transforms.push(transform)

    }

    transformsToString() {

        return JSON.stringify(this.transforms.map(transform => transform.toString()))

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
     * @param {stream.Writable} writableStream The writable strem
     * @return {Stream}
     */
    pipe(writableStream) {

        return this.getStream().pipe(writableStream)

    }

    /**
     * Gets the stream from source glob pattern and modified by the modfier.
     *
     * @return {Stream}
     * @throws {Error} When
     */
    getStream() {

        if (this.transformStream) {
            return vfs.src().pipe(this.transformStream)
        }

        const stream = this.transforms.reduce((stream, transform) => transform(stream), vfs.src(this.paths, this.opts))

        if (!(stream instanceof Stream)) {

            throw new Error(`Asset transforms must return a stream (asset path: [${this.paths.toString()}], transforms: ${this.transformsToString()})`)

        }

        return stream

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
