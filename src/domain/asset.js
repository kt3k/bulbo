import vfs from 'vinyl-fs'
import {Readable} from 'stream'
import * as through from '../util/through'

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
        this.transformIn = through.obj()
        this.transformOut = through.obj()

        this.pipes = [this.transformIn, this.transformOut]

    }

    /**
     * Returns the total buffer length in the pipeline.
     * @return {number}
     */
    totalBufferLength() {

        return this.pipes.map(pipe => pipe._readableState.length).reduce((x, y) => x + y, 0)

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
     * @param {Writable} writableStream The writable strem
     */
    pipe(writable) {

        this.transformOut.pipe(writable)

    }

    /**
     * Pours the source files into the transform stream.
     * @param {object} options The pipe options
     */
    reflow(options, cb) {

        this.createTransform()

        const source = this.getSourceStream()

        const ondata = () => {

            if (this.totalBufferLength() === 0) {

                this.transformOut.removeListener('data', ondata)
                cb(null)

            }

        }

        if (cb) {

            this.transformOut.on('data', ondata)

        }

        source.pipe(this.transformIn, options)

        return source
    }

    /**
     * Gets the source stream.
     * @return {Readable}
     */
    getSourceStream() {

        return vfs.src(this.paths, this.opts)

    }

    /**
     * Creates the transform sequence.
     * @private
     * @throws {Error} When the transfroms are invalid
     */
    createTransform() {

        if (this.transformReady) {
            return
        }

        // Pipes the transforms from In to Out
        this.transforms.reduce((readable, transform) => {

            const transformed = transform(readable)

            this.pipes.push(transformed)

            return transformed

        }, this.transformIn).pipe(this.transformOut)

        if (!(this.transformOut instanceof Readable)) {

            throw new Error(`Asset transforms must return a readable stream (asset path: [${this.paths.toString()}], transforms: ${this.transformsToString()})`)

        }

        this.transformReady = true

    }

    /**
     * Gets the readable end of the transform stream.
     * @return {Readable}
     */
    getStream() {

        return this.transformOut

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
