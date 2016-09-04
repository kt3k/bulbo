const chalk = require('chalk')
const minimisted = require('minimisted')
const dispatch = require('cli-dispatch')

const logger = require('../util/logger')('bulbo')
const usage = require('./usage')

/**
 * @param {object} _ The positional paremeters
 * @param {object} v The version flag
 * @param {object} version The version flag
 * @param {object} h The help flag
 * @param {object} help The help flag
 */
minimisted(function ({_: [action], v, version, h, help}) {
  if (v || version) {
    action = 'version'
  }

  if (h || help) {
    action = 'help'
  }

  if (!action) {
    action = 'serve'
  }

  dispatch(action, Object.assign({logger}, arguments[0])).on('no-action', () => {
    console.log(chalk.red(`Error: No such action: ${action}`))
    usage()
    process.exit(1)
  })
})
