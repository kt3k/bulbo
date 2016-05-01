import watch from '../util/watch'
import logger from '../util/logger'
import chalk from 'chalk'
import vinylServe from 'vinyl-serve'

export default class AssetServer {

    /**
     * @param {AssetCollection} assets The assets
     * @param {Number} port The port number
     */
    constructor(assets, port) {

        this.assets = assets
        this.port = port

        vinylServe.setDebugPageTitle('Welcome to <i>Bulbo</i> asset path debug page!')
        vinylServe.setDebugPagePath('/__bulbo__')
        vinylServe.setHandlerOfStarting((url, debugUrl) => {

            logger.log('Server started at:', chalk.cyan(url))
            logger.log('See debug page is:', chalk.cyan(debugUrl))

        })

        vinylServe.setHandlerOfPortError(port => {

            logger.log(chalk.red(`Error: The port number ${port} is already in use`))

            process.exit(1)

        })

    }

    /**
     * Serves, watching paths for assets.
     * @param {Function} cb The callback
     * @return {Promise}
     */
    serve() {

        const serverWritable = vinylServe(this.port)

        this.assets.forEach(asset => {

            asset.getStream().pipe(serverWritable)

            watch(asset.getWatchPaths(), asset.getWatchOpts(), () => {

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

        return vinylServe.getInstance(this.port).startPromise

    }

}
