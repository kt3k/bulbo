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
        this.modifier = id

    }

    /**
     * Adds the watch paths.
     * @param {string|string[]} paths The paths
     */
    addWatchPaths(paths) {
        this.watchPaths = this.watchPaths.concat(paths)
    }

    /**
     * Gets the static setter of the modifier.
     *
     * @return {Function}
     */
    getModifierSetter() {

        const asset = this

        return {
            /**
             * Sets the build function.
             * @param {Function} build The build method
             */
            build(build) {
                asset.modifier = build
            },

            /**
             * Sets the watch paths and opts.
             * @param {string|string[]}
             */
            watch(watchPaths) {
                asset.watchPaths = asset.watchPaths.concat(watchPaths)
            },

            watchOptions(watchOptions) {
                asset.watchOptions = watchOptsions
            },

            /**
             * Sets the base path.
             * @param {string} base The base path
             */
            base(base) {
                assets.opts.base = base
            }

        }

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

        const stream = this.modifier(vfs.src(this.glob, this.opts))

        if (!(stream instanceof Stream)) {

            throw new Error('Asset modifier must return a stream (asset path: [' + this.glob.toString() + '], modifier: ' + this.modifier + ')')

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
