const chalk = require('chalk')
const interpret = require('interpret')
const Liftoff = require('liftoff')
const minimisted = require('minimisted')
const dispatch = require('cli-dispatch')

const logger = require('../util/logger')
const usage = require('./usage')

/**
 * @param {object} _ The positional paremeters
 * @param {object} v The version flag
 * @param {object} version The version flag
 * @param {object} h The help flag
 * @param {object} help The help flag
 */
minimisted(function main ({_: [action], v, version, h, help}) {
  if (v || version) {
    action = 'version'
  }

  if (h || help) {
    action = 'help'
  }

  if (!action) {
    action = 'serve'
  }

  new Liftoff({name: 'bulbo', extensions: interpret.jsVariants})

  .on('require', name => { logger.log('Requiring external module', chalk.magenta(name)) })

  .on('requireFail', name => { console.error('Failed to load external module', name) })

  .launch({}, env => onLaunch(env, action, arguments[0]))
})

/**
 * Liftoff launch handler
 * @param {Object} env Litfoff env object
 * @param {string} action The action
 * @param {object} argv The parameter
 */
function onLaunch (env, action, argv) {
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

  require(env.configPath)

  if (bulbo.isEmpty()) {
    console.log(chalk.red('Error: No asset defined in bulbofile'))

    process.exit(1)
  }

  dispatch(action, Object.assign({bulbo}, argv)).on('no-action', () => {
    console.log(chalk.red(`Error: No such action: ${action}`))
    usage()
    process.exit(1)
  })
}
