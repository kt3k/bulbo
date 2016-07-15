import logger from '../util/logger'
import chalk from 'chalk'

export default class AssetWatcher {

    constructor(assets) {

        this.assets = assets

    }

    /**
     * Watches all the assets and pipes everything into the given writable
     * @param {Writable} writable The writable
     */
    watchAndPipe(writable) {

        this.assets.forEach(asset => {

            asset.getStream().pipe(writable)

            asset.watch(() => {

                logger.log('❗️ File changed:', chalk.magenta(asset.toString()))

                asset.reflow({end: false}, () => {

                    logger.log('✅ Files ready:', chalk.magenta(asset.toString()))

                })

            })

            logger.log('Reading files:', chalk.magenta(asset.toString()))

            asset.reflow({end: false}, () => {

                logger.log('✅ Files ready:', chalk.magenta(asset.toString()))

            })

        })

    }

}