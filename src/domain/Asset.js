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
    constructor(glob, opts) {

        opts = opts || {}

        this.glob = glob
        this.opts = opts
        this.watchPath = opts.watch || this.glob
        this.watchOpts = opts.watchOpts
        this.modifier = id

    }

    /**
     * Gets the static setter of the modifier.
     *
     * @return {Function}
     */
    getModifierSetter() {

        const asset = this

        /**
         * Static setter of modifier
         * @param {Function} modifier The modifier
         */
        return function (modifier) {

            asset.modifier = modifier

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
    getWatchPath() {

        return this.watchPath

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
