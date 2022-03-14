const { EventEmitter } = require("events");

class AssetWatcher extends EventEmitter {
  /**
   * @param {AssetCollection} assets The assets
   */
  constructor(assets) {
    super();

    this.assets = assets;
  }

  /**
   * Watches all the assets and pipes everything into the given writable
   * @param {Writable} writable The writable
   * @param {Object} options The options
   * @param {string} options.base The default base path of the asset
   */
  watchAndPipe(writable, options) {
    options = options || {};

    this.assets.forEach((asset) => {
      asset.getStream().pipe(writable);

      asset.watch(() => {
        this.emit("changed", asset);

        asset.reflow(
          { end: false, base: options.base },
          () => this.emit("ready", asset),
        );
      });

      this.emit("reading", asset);

      asset.reflow(
        { end: false, base: options.base },
        () => this.emit("ready", asset),
      );
    });
  }

  /**
   * Unwatches the assets
   */
  unwatch() {
    this.assets.forEach((asset) => asset.unwatch());
  }
}

module.exports = AssetWatcher;
