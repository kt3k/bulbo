const bulbo = require('../../bulbo')
const chalk = require('chalk')

/**
 * The serve action.
 */
module.exports = () => {
  bulbo.cli.liftoff('bulbo').then(bulbo => {
    if (bulbo.isEmpty()) {
      bulbo.logger.log(chalk.red('Error: No asset defined'))

      process.exit(1)
    }

    bulbo.serve()
  })
}
