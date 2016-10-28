const AssetCollection = require('../domain/asset-collection')
const AssetServer = require('./asset-server')
const AssetBuilder = require('./asset-builder')
const chalk = require('chalk')

const DEFAULT_DEST = 'build' // The default destination
const DEFAULT_PORT = 7100 // The default port number
const DEFAULT_DEBUG_PAGE_TITLE = 'Welcome to <i>Bulbo</i> asset path debug page!'
const DEFAULT_DEBUG_PAGE_PATH = '__bulbo__'

/**
 * AssetService manages, builds and serves the collection of assets.
 */
class AssetService {
  constructor () {
    this.assets = new AssetCollection()

    this.reset()

    this.assets.on('error', (err, asset) => {
      this.logger.log(chalk.red('Error: ' + asset.toString()))
      this.logger.log(chalk.red(err.stack))
    })
  }

  setLogger (logger) {
    this.logger = logger
  }

  /**
   * Adds the asset
   * @private
   * @param {Asset} asset The asset
   */
  addAsset (asset) {
    this.assets.add(asset)
  }

  /**
   * Serves the assets.
   * @return {Promise} Resolves when the server started
   */
  serve () {
    const server = new AssetServer(this.assets, this.port, this.logger, this.debugPageTitle, this.debugPagePath)

    server.on('reading', asset => this.logger.log(chalk.yellow('Reading:'), chalk.magenta(asset.toString())))
    server.on('changed', asset => this.logger.log(chalk.yellow('Changed:'), chalk.magenta(asset.toString())))
    server.on('ready', asset => this.logger.log(chalk.green('Ready:'), chalk.magenta(asset.toString())))

    this.watcher = server

    return server.serve({base: this.base})
  }

  /**
   * Builds the assets.
   * @return {Promise} Resolves when the assets built
   */
  build () {
    return new AssetBuilder(this.assets, this.dest, this.logger).build({base: this.base})
  }

  /**
   * Watches and builds the assets.
   */
  watchAndBuild () {
    const builder = new AssetBuilder(this.assets, this.dest, this.logger)

    builder.on('reading', asset => this.logger.log(chalk.yellow('Reading:'), chalk.magenta(asset.toString())))
    builder.on('changed', asset => this.logger.log(chalk.yellow('Changed:'), chalk.magenta(asset.toString())))
    builder.on('ready', asset => this.logger.log(chalk.green('Ready:'), chalk.magenta(asset.toString())))

    this.watcher = builder

    builder.watchAndBuild({base: this.base})
  }

  /**
   * Unwatches the asset if a server or a builder exists.
   */
  unwatch () {
    if (this.watcher) {
      this.watcher.unwatch()
    }
  }

  /**
   * Sets the port number.
   * @param {Number} port The port number
   */
  setPort (port) {
    this.port = port
  }

  /**
   * Sets the destination.
   * @param {String} dest The destination of the build
   */
  setDest (dest) {
    this.dest = dest
  }

  /**
   * Sets the debug page title.
   * @param {string} debugPageTitle The debug page title
   */
  setDebugPageTitle (debugPageTitle) {
    this.debugPageTitle = debugPageTitle
  }

  /**
   * Sets the debug page path.
   * @param {string} debugPagePath The debug page path
   */
  setDebugPagePath (debugPagePath) {
    this.debugPagePath = debugPagePath
  }

  /**
   * @param {string} base The default base path for assets.
   */
  setAssetBasePath (base) {
    this.base = base
  }

  /**
   * Returns if the assets are empty.
   * @return {Boolean}
   */
  isEmpty () {
    return this.assets.isEmpty()
  }

  /**
   * Clears all the assets.
   */
  clear () {
    this.reset()
  }

  /**
   * Resets the settings.
   */
  reset () {
    this.assets.empty()

    this.base = null
    this.dest = DEFAULT_DEST
    this.port = DEFAULT_PORT
    this.debugPageTitle = DEFAULT_DEBUG_PAGE_TITLE
    this.debugPagePath = DEFAULT_DEBUG_PAGE_PATH
  }
}

module.exports = AssetService
