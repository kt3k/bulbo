const chalk = require('chalk')
const { jsVariants } = require('interpret')
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
  options = options || {}

  const logger = console
  const configName = options.configName || `${name}file`

  return new Promise((resolve, reject) => {
    new Liftoff({ name, configName, extensions: jsVariants })

    .on('require', moduleName => { logger.log('Requiring external module', chalk.magenta(moduleName)) })

    .on('requireFail', moduleName => { logger.log(chalk.red(`Failed to load external module ${moduleName}`)) })

    .launch({}, env => {
      if (!env.modulePath) {
        logger.log(chalk.red(`Error: Local ${name} module not found`))
        logger.log('Try running:', chalk.green(`npm install ${name}`))

        process.exit(1)
      }

      const module = require(env.modulePath)

      module.setLogger(require('./logger')(name))

      if (options.configIsOptional && !env.configPath) {
        return resolve({ module })
      }

      if (!env.configPath) {
        logger.log(chalk.red(`Error: No ${configName} found`))

        process.exit(1)
      }

      logger.log('Using:', chalk.magenta(env.configPath))

      try {
        const config = require(env.configPath)

        return resolve({ config, module })
      } catch (e) {
        logger.log(chalk.red(e.stack))

        process.exit(1)
      }
    })
  })
}
