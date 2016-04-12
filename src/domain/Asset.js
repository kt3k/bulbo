import vfs from 'vinyl-fs'
import {Stream} from 'stream'

/**
 * The identity function - default for stream modifier.
 * @param {Object} x any
 * @return {Object}
 */
const id = x => x

/**
 * The model of asset
 */
export default class Asset {

    /**
     * @constructor
     * @param {String|String[]} glob The glob pattern
     * @param {Object} [opts] The options to vinyl-fs#src
     * @param {String|String[]} [opts.watch] The watch path (if omitted then equals to glob)
     * @param {String|String[]} [opts.watchOpts] The watch opation to chokidar#watch
     */
    constructor(glob, opts = {}) {

        this.glob = glob
        this.opts = opts
        this.watchPaths = []
        this.watchOpts = {}
        this.transforms = []

    }

    /**
     * Adds the watch paths.
     * @param {string|string[]} paths The paths
     */
    addWatchPaths(paths) {
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

        this.watchOpts = opts

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

        const stream = this.transforms.reduce((stream, transform) => transform(stream), vfs.src(this.glob, this.opts))

        if (!(stream instanceof Stream)) {

            throw new Error(`Asset transforms must return a stream (asset path: [${this.glob.toString()}], transforms: ${this.transformsToString()})`)

        }

        return stream

    }

    /**
     * Gets the watch path(s).
     *
     * @return {String|String[]}
     */
    getWatchPaths() {

        return this.watchPaths || this.glob

    }

    /**
     * Gets the watch opts.
     *
     * @return {Object}
     */
    getWatchOpts() {

        return this.watchOpts

    }

}
