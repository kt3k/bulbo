const chokidar = require("chokidar");

/**
 * Watches the given patterns with chokidor and kicks the callback if file is created, removed or changed.
 *
 * @param {String|String[]} glob The pattern(s)
 * @param {Object} opts The chokidar watch options
 * @param {Function} cb The callback
 */
module.exports = function (glob, opts, cb) {
  opts = opts || {};

  opts.ignoreInitial = typeof opts.ignoreInitial === "boolean"
    ? opts.ignoreInitial
    : true;

  return chokidar.watch(glob, opts)
    .on("unlink", cb)
    .on("change", cb)
    .on("add", cb);
};
