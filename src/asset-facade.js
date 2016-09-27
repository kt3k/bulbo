/**
 * The interface which exposes as "asset" in bulbofile
 */
class AssetFacade {
  /**
   * @param {Asset} asset The asset to modify
   */
  constructor (asset) {
    this.assetModel = asset
  }

  /**
   * Gets the asset model.
   * @return {Asset}
   */
  getAssetModel () {
    return this.assetModel
  }

  /**
   * Adds the asset paths.
   * @param {Array<string|string[]>} paths The paths
   */
  asset (...paths) {
    this.getAssetModel().addAssetPaths(...paths)

    return this
  }

  /**
   * Sets the asset options.
   * @param {object} opts The options to pass to the vinyl-fs
   */
  assetOptions (opts) {
    this.getAssetModel().setAssetOpts(opts)

    return this
  }

  /**
   * Sets the watch paths and opts.
   * @param {Array<string|string[]>} watchPaths The paths to watch
   */
  watch (...watchPaths) {
    this.getAssetModel().addWatchPaths(...watchPaths)

    return this
  }

  /**
   * Sets the watch options.
   * @param {object} options The watch options
   */
  watchOptions (options) {
    this.getAssetModel().setWatchOpts(options)

    return this
  }

  /**
   * Sets the base path.
   * @param {string} base The base path
   */
  base (base) {
    this.getAssetModel().setAssetOpts({base})

    return this
  }

  /**
   * Adds the trasform of transform stream.
   * @param {Transform} transform The transform to pass to the vinyl stream
   */
  pipe (transform) {
    this.getAssetModel().addPipe(transform)

    return this
  }
}

module.exports = AssetFacade
