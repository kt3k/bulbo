const chalk = require('chalk')
const minimisted = require('minimisted')
const minirocket = require('minirocket')

const logger = require('../util/logger')('bulbo')
const usage = require('./usage')

/**
 * @param {boolean} v The version flag
 * @param {boolean} version The version flag
 * @param {boolean} h The help flag
 * @param {boolean} help The help flag
 * @param {string} action The action name
 */
minimisted(argv => {
  const {v, version, h, help, _: [action]} = argv

  minirocket({
    version: v || version,
    help: h || help,
    serve: !action,
    [action]: true
  }, Object.assign({logger}, argv)).on('no-action', name => {
    console.log(chalk.red(`Error: No such action: ${action}`))
    usage()
    process.exit(1)
  })
})
