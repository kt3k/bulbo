import chalk from 'chalk'

export default class AssetWatcher {
  /**
   * @param {AssetCollection} assets The assets
   * @param {Logger} logger The logger
   */
  constructor (assets, logger) {
    this.assets = assets
    this.logger = logger
  }

  /**
   * Watches all the assets and pipes everything into the given writable
   * @param {Writable} writable The writable
   */
  watchAndPipe (writable) {
    this.assets.forEach(asset => {
      asset.getStream().pipe(writable)

      asset.watch(() => {
        this.logger.log(chalk.yellow('Changed:'), chalk.magenta(asset.toString()))

        asset.reflow({end: false}, () => {
          this.logger.log(chalk.green('Ready:'), chalk.magenta(asset.toString()))
        })
      })

      this.logger.log(chalk.yellow('Reading:'), chalk.magenta(asset.toString()))

      asset.reflow({end: false}, () => {
        this.logger.log(chalk.green('Ready:'), chalk.magenta(asset.toString()))
      })
    })
  }
}
