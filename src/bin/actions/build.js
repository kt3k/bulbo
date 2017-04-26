const bulbo = require('../../')
const chalk = require('chalk')

/**
 * The serve action.
 * @param {boolean} w The watch flag
 * @param {boolean} watch The watch flag
 */
module.exports = ({ w, watch }) => {
  bulbo.cli.liftoff('bulbo').then(({ module: bulbo }) => {
    if (bulbo.isEmpty()) {
      bulbo.logger.log(chalk.red('Error: No asset defined'))

      process.exit(1)
    }

    if (w || watch) {
      bulbo.watchAndBuild()
    } else {
      bulbo.build()
    }
  })
}
