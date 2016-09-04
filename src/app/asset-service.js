import AssetCollection from '../domain/asset-collection'
import AssetServer from './asset-server'
import AssetBuilder from './asset-builder'
import chalk from 'chalk'

/**
 * AssetService manages, builds and serves the collection of assets.
 */
export default class AssetService {
  /**
   * @param {String} dest The destination
   * @param {Number} port The port number
   */
  constructor (dest, port) {
    this.assets = new AssetCollection()
    this.dest = dest
    this.port = port

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
    return new AssetServer(this.assets, this.port, this.logger).serve()
  }

  /**
   * Builds the assets.
   * @return {Promise} Resolves when the assets built
   */
  build () {
    return new AssetBuilder(this.assets, this.dest, this.logger).build()
  }

  /**
   * Watches and builds the assets.
   */
  watchAndBuild () {
    return new AssetBuilder(this.assets, this.dest, this.logger).watchAndBuild()
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
    this.assets.empty()
  }
}
