import logger from '../util/logger'
import chalk from 'chalk'
import vinylServe from 'vinyl-serve'
import AssetWatcher from './asset-watcher'

export default class AssetServer extends AssetWatcher {
  /**
   * @param {AssetCollection} assets The assets
   * @param {Number} port The port number
   */
  constructor (assets, port) {
    super(assets)

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
  serve () {
    logger.log(chalk.green('serving'))

    this.watchAndPipe(vinylServe(this.port))

    return vinylServe.getInstance(this.port).startPromise
  }
}
