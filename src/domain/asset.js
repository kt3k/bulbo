import vfs from 'vinyl-fs'
import pipeline from '../util/pipeline'
import watch from '../util/watch'
import {EventEmitter} from 'events'
import plumber from 'gulp-plumber'

/**
 * The model of asset
 */
class Asset extends EventEmitter {
  /**
   * @constructor
   * @param {Array<string|string[]>} paths The paths to build
   */
  constructor (...paths) {
    super()

    this.paths = []
    this.addAssetPaths(...paths)
    this.opts = {}
    this.watchPaths = []
    this.watchOpts = {}

    this.pipeline = pipeline.obj().on('error', err => this.emit('error', err))

    this.addPipe(plumber())
  }

  /**
   * Adds the asset paths.
   * @param {Array<string|string[]>} paths The paths to build
   */
  addAssetPaths (...paths) {
    this.paths = this.paths.concat(...paths)
  }

  /**
   * Sets the asset options.
   * @param {object} opts The asset options to pass to vinyl-fs when creating vinyl stream
   */
  setAssetOpts (opts) {
    Object.assign(this.opts, opts)
  }

  /**
   * Adds the watch paths.
   * @param {string|string[]} paths The paths
   */
  addWatchPaths (...paths) {
    this.watchPaths = this.watchPaths.concat(paths)
  }

  /**
   * @param {Transform}
   */
  addPipe (pipe) {
    this.pipeline.push(pipe)
  }

  /**
   * Sets the watch opts.
   * @param {object} opts The watch opts
   */
  setWatchOpts (opts) {
    Object.assign(this.watchOpts, opts)
  }

  /**
   * Pours the source files into the transform stream.
   * @param {object} options The pipe options
   * @param {Function} cb The callback
   */
  reflow (options, cb) {
    this.getSourceStream().pipe(this.pipeline, options)

    if (cb) { this.pipeline.once('buffer-empty', cb) }
  }

  /**
   * Gets the source stream.
   * @private
   * @return {Readable}
   */
  getSourceStream () {
    return vfs.src(this.paths, this.opts)
  }

  /**
   * Gets the readable end of the transform stream.
   * @return {Readable}
   */
  getStream () {
    return this.pipeline
  }

  /**
   * Gets the watch path(s).
   * @private
   * @return {String|String[]}
   */
  getWatchPaths () {
    return this.watchPaths.length > 0 ? this.watchPaths : this.paths
  }

  /**
   * Starts watching the given watch paths.
   * @param {Function} cb The callback
   */
  watch (cb) {
    watch(this.getWatchPaths(), this.watchOpts, cb)
  }

  /**
   * Returns a string expression
   */
  toString () {
    return this.paths.toString()
  }
}

module.exports = Asset
