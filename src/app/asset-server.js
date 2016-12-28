'use strict'

const chalk = require('chalk')
const vinylServe = require('vinyl-serve')
const AssetWatcher = require('./asset-watcher')
const path = require('path')

class AssetServer extends AssetWatcher {
  /**
   * @param {AssetCollection} assets The assets
   * @param {Number} port The port number
   * @param {Logger} logger The logger
   * @param {string} [debugPageTitle] The page title of the debug page. Html tags are available. Optional.
   * @param {string} [debugPagePath] The path of the debug page. Default is '__bulbo__'.
   */
  constructor (assets, port, logger, debugPageTitle, debugPagePath) {
    super(assets)

    this.port = port
    this.logger = logger

    vinylServe.setDebugPageTitle(debugPageTitle)
    vinylServe.setDebugPagePath(`/${debugPagePath}`)
    vinylServe.setHandlerOfStarting((url, debugUrl) => {
      this.logger.log('Server started at:', chalk.cyan(url))
      this.logger.log('See debug info at:', chalk.cyan(debugUrl))
    })

    vinylServe.setHandlerOfPortError(port => {
      this.logger.log(chalk.red(`Error: The port number ${port} is already in use`))

      process.exit(1)
    })
  }

  /**
   * Serves, watching paths for assets.
   * @param {Object} options The options
   * @return {Promise}
   */
  serve (options) {
    this.logger.log(chalk.green('serving'))

    this.watchAndPipe(vinylServe(this.port), options)

    return vinylServe.getInstance(this.port).startPromise
  }
}

module.exports = AssetServer
