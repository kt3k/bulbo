const chalk = require('chalk')
const interpret = require('interpret')
const Liftoff = require('liftoff')

/**
 * @param {Logger} logger The logger
 */
module.exports = function (logger) {
  return new Promise((resolve, reject) => {
    new Liftoff({name: 'bulbo', extensions: interpret.jsVariants})

    .on('require', name => { logger.log('Requiring external module', chalk.magenta(name)) })

    .on('requireFail', name => { console.error('Failed to load external module', name) })

    .launch({}, env => {
      if (!env.modulePath) {
        console.log(chalk.red('Error: Local bulbo module not found'))
        console.log('Try running:', chalk.green('npm install bulbo'))

        process.exit(1)
      }

      if (!env.configPath) {
        console.log(chalk.red('Error: No bulbofile found'))

        process.exit(1)
      }

      logger.log('Using:', chalk.magenta(env.configPath))

      const bulbo = require(env.modulePath)

      bulbo.setLogger(logger)

      require(env.configPath)

      if (bulbo.isEmpty()) {
        console.log(chalk.red('Error: No asset defined in bulbofile'))

        process.exit(1)
      }

      resolve(bulbo)
    })
  })
}
