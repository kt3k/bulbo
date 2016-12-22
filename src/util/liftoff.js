const chalk = require('chalk')
const {jsVariants} = require('interpret')
const Liftoff = require('liftoff')

/**
 * Lifts off the module using js-liftoff.
 * @param <T> The type of the module to load
 * @param {string} name The name of the module
 * @param {object} options The options
 * @param {boolean} [options.configIsOptional] True iff the config file is optional. Default is false.
 * @return {Promise<T>} The module interface
 */
module.exports = (name, options) => {
  const logger = require('./logger')(name)
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

      if (options.configIsOptional && !env.configPath) {
        resolve(moduleIf)
        return
      }

      if (!env.configPath) {
        logger.log(chalk.red(`Error: No ${name}file found`))

        process.exit(1)
      }

      logger.log('Using:', chalk.magenta(env.configPath))

      try {
        require(env.configPath)
      } catch (e) {
        logger.log(chalk.red(e.stack))

        process.exit(1)
      }

      resolve(moduleIf)
    })
  })
}
