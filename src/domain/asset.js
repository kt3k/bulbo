import vfs from 'vinyl-fs'
import pipeline from '../util/pipeline'
import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import watch from '../util/watch'

/**
 * The model of asset
 */
export default class Asset extends EventEmitter {

    /**
     * @constructor
     * @param {Array<string|string[]>} paths The paths to build
     */
    constructor(...paths) {

        super()

        this.paths = []
        this.addAssetPaths(...paths)
        this.opts = {}
        this.watchPaths = []
        this.watchOpts = {}

        this.pipeline = pipeline.obj([PassThrough({objectMode: true})])

        this.pipeline.on('buffer-empty', () => this.emit('ready'))

        this._ready = new Promise((resolve, reject) => {

            this.pipeline.once('buffer-empty', resolve)
            this.pipeline.on('error', reject)

        })

    }

    /**
     * Returns a promise which resolves when the first flow of the source stream is finished.
     * @return {Promise}
     */
    isReady() {

        return this._ready

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

        this.setAssetOpts({base})

    }

    /**
     * Sets the watch opts.
     * @param {object} opts The watch opts
     */
    setWatchOpts(opts) {

        Object.assign(this.watchOpts, opts)

    }

    /**
     * Pours the source files into the transform stream.
     * @param {object} options The pipe options
     * @param {Function} cb The callback
     */
    reflow(options) {

        this.getSourceStream().pipe(this.pipeline, options)

    }

    /**
     * Gets the source stream.
     * @private
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
     * Starts watching the paths.
     * @param {Function} cb The callback
     */
    watch(cb) {
        watch(this.getWatchPaths(), this.getWatchOpts(), cb)
    }

    /**
     * Returns a string expression
     */
    toString() {
        return this.paths.toString()
    }

}
