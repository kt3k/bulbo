import vfs from 'vinyl-fs'
import * as drain from '../util/drain'
import AssetWatcher from './asset-watcher'
import logger from '../util/logger'
import chalk from 'chalk'

/**
 * The service class which builds the assets to the file system.
 */
export default class AssetBuilder extends AssetWatcher {

    /**
     * @constructor
     * @param {AssetCollection} assets The assets
     * @param {String} dest The destination
     */
    constructor(assets, dest) {

        super(assets)

        this.dest = dest

    }

    /**
     * Builds the assets.
     * @return {Promise}
     */
    build() {

        logger.log(chalk.green('building'))

        const stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest)).pipe(drain.obj())

        this.assets.forEach(asset => asset.reflow())

        return new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject))
            .then(() => logger.log(chalk.green('done')))

    }

    /**
     * Watches and builds.
     */
    watchAndBuild() {

        logger.log(chalk.green('watching and building'))

        this.watchAndPipe(vfs.dest(this.dest))

    }

}
