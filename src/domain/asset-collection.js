const mergeStream = require("../util/mergeStream");
const { EventEmitter } = require("events");

/**
 * The collection class of assets.
 */
class AssetCollection extends EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.assets = [];
  }

  /**
   * Adds the asset.
   * @param {Asset} asset The asset
   */
  add(asset) {
    asset.on("error", (err) => this.emit("error", err, asset));

    this.assets.push(asset);
  }

  /**
   * Gets the merged stream of assets.
   * @return {Stream}
   */
  getMergedStream() {
    return mergeStream(this.assets.map((asset) => asset.getStream()));
  }

  /**
   * Invokes the callback for each item with the given context.
   * @param {Function} cb The callback
   * @param {Object} ctx The this context
   */
  forEach(cb, ctx) {
    this.assets.forEach(cb, ctx);
  }

  /**
   * Returns if the assets are empty.
   * @return {Boolean}
   */
  isEmpty() {
    return this.assets.length === 0;
  }

  /**
   * Empties the assets list.
   */
  empty() {
    this.assets.splice(0);
  }
}

module.exports = AssetCollection;
