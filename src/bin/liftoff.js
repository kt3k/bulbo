const chalk = require('chalk')
const {jsVariants} = require('interpret')
const Liftoff = require('liftoff')

/**
 * Lifts off the module using js-liftoff.
 * @param {string} name The name of the module
 * @param {object} options The options
 * @return {Promise}
 */
module.exports = (name, options) => {
  const logger = require('../util/logger')(name)
  options = options || {}

  return new Promise((resolve, reject) => {
    new Liftoff({name, extensions: jsVariants})

    .on('require', moduleName => { logger.log('Requiring external module', chalk.magenta(moduleName)) })

    .on('requireFail', moduleName => { logger.log(chalk.red(`Failed to load external module ${moduleName}`)) })

    .launch({}, env => {
      if (!env.modulePath) {
        logger.log(chalk.red(`Error: Local ${name} module not found`))
        logger.log('Try running:', chalk.green(`npm install ${name}`))

        process.exit(1)
      }

      const moduleIf = require(env.modulePath)

      moduleIf.setLogger(logger)

      if (!env.configPath) {
        logger.log(chalk.red(`Error: No ${name}file found`))

        process.exit(1)
      }

      logger.log('Using:', chalk.magenta(env.configPath))

      require(env.configPath)

      if (moduleIf.isEmpty()) {
        logger.log(chalk.red('Error: No asset defined'))

        process.exit(1)
      }

      resolve(moduleIf)
    })
  })
}
