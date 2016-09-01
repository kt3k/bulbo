import chalk from 'chalk'
import interpret from 'interpret'
import Liftoff from 'liftoff'
import minimisted from 'minimisted'
import logger from '../util/logger'

import pkg from '../../package'

function version () {
    console.log(pkg.name + '@' + pkg.version)
}

function usage () {
    console.log('Usage: bulbo [build|serve]')
}

/**
 * Returns if the command is valid.
 * @param {string} commant The command
 * @return {Boolean}
 */
function isCommandValid (command) {
    return /^s|b/.test(command)
}

function getAction (command, argv) {
    if (/^s/.test(command)) {
        return 'serve'
    } if (/^b/.test(command)) {
        if (!argv.w) {
            return 'build'
        } else {
            return 'watchAndBuild'
        }
    }
}

/**
 * @param {object} argv The minimist parsed object
 */
minimisted(function main (argv) {
    if (argv.version) {
        version()
        process.exit(0)
    }

    const command = argv._[0] || 'serve'

    if (!isCommandValid(command)) {
        usage()
        process.exit(1)
    }

    const action = getAction(command, argv)

    new Liftoff({name: 'bulbo', extensions: interpret.jsVariants})

    .on('require', name => { logger.log('Requiring external module', chalk.magenta(name)) })

    .on('requireFail', name => { console.error('Failed to load external module', name) })

    .launch({}, env => onLaunch(env, action))
})

/**
 * Liftoff launch handler
 * @param {Object} env Litfoff env object
 * @param {string} action The action
 */
function onLaunch (env, action) {
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

        process.exit()
    }

    if (action === 'build') { // build
        bulbo.build()
    } else if (action === 'watchAndBuild') { // watch and build
        bulbo.watchAndBuild()
    } else if (action === 'serve') { // serve
        bulbo.serve()
    } else {
        throw new Error('Unkown action: ' + action)
    }
}
