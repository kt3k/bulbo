/**
 * The factory class of asset modifiers.
 */
export default class AssetModifierFactory {

    /**
     * @param {Asset} asset The asset
     */
    static createFromAsset(asset) {

        const modifier = {
            /**
             * Sets the build function.
             * @param {Function} transform The build method takes a {@code Stream} and returns a {@code Stream}
             */
            build(transform) {

                asset.addTransform(transform)

                return modifier

            },

            /**
             * Sets the watch paths and opts.
             * @param {string|string[]}
             */
            watch(watchPaths) {

                asset.addWatchPaths(watchPaths)

                return modifier

            },

            /**
             * Sets the watch options.
             * @param {object} options The watch options
             */
            watchOptions(options) {

                asset.setWatchOpts(options)

                return modifir

            },

            /**
             * Sets the base path.
             * @param {string} base The base path
             */
            base(base) {

                asset.setBase(base)

                return modifier

            }
        }

        return modifier
    }
}
