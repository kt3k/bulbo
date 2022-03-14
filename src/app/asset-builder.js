const vfs = require("vinyl-fs");
const drain = require("../util/drain");
const AssetWatcher = require("./asset-watcher");
const chalk = require("chalk");

/**
 * The service class which builds the assets to the file system.
 */
class AssetBuilder extends AssetWatcher {
  /**
   * @constructor
   * @param {AssetCollection} assets The assets
   * @param {String} dest The destination
   * @param {Logger} logger The logger
   */
  constructor(assets, dest, logger) {
    super(assets);

    this.logger = logger;
    this.dest = dest;
  }

  /**
   * Builds the assets.
   * @return {Promise}
   */
  build(options) {
    options = options || {};

    this.logger.log(chalk.green("building"));

    const stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest)).pipe(
      drain.obj(),
    );

    this.assets.forEach((asset) => asset.reflow({ base: options.base }));

    return new Promise((resolve, reject) =>
      stream.on("end", resolve).on("error", reject)
    )
      .then(() => this.logger.log(chalk.green("done")));
  }

  /**
   * Watches and builds.
   * @param {Object} options The options
   */
  watchAndBuild(options) {
    this.logger.log(chalk.green("watching and building"));

    this.watchAndPipe(vfs.dest(this.dest), options);
  }
}

module.exports = AssetBuilder;
