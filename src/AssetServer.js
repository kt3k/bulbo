import watch from './watch'
import logger from './logger'
import chalk from 'chalk'
import vinylServe from 'vinyl-serve'

vinylServe.setDebugPageTitle('Welcome to <i>Bulbo</i> asset path debug page!')
vinylServe.setDebugPagePath('/__bulbo__')
vinylServe.setHandlerOfStarting((url, debugUrl) => {

    console.log('Server started at:', chalk.cyan(url))
    console.log('See debug page is:', chalk.cyan(debugUrl))

})

vinylServe.setHandlerOfPortError(port => {

    console.log(chalk.red(`Error: The port number ${port} is already in use`))

    process.exit(1)

})

export default class AssetServer {

    /**
     * @param {AssetCollection} assets The assets
     * @param {Number} port The port number
     */
    constructor(assets, port) {

        this.assets = assets
        this.port = port

    }

    /**
     * Serves, watching paths for assets.
     *
     * @param {Function} cb The callback
     */
    serve(cb) {

        this.assets.forEach(asset => {

            watch(asset.getWatchPath(), asset.getWatchOpts(), () => {

                logger.log('❗️ File changed:', chalk.magenta(asset.glob))

                asset.pipe(vinylServe(this.port)).on('end', () => {

                    logger.log('✅ Files ready:', chalk.magenta(asset.glob))

                })

            })

        })

        this.assets.getMergedStream().pipe(vinylServe(this.port)).on('end', () => {

            logger.log('✅ All files ready')

        })

        if (typeof cb === 'function') {

            vinylServe.getInstance(this.port)
                .startPromise
                .then(() => { cb(null) })
                .catch(err => { cb(err) })

        }

    }

}
