import chalk from 'chalk'
import interpret from 'interpret'
import Liftoff from 'liftoff'
import minimist from 'minimist'

import pkg from '../../package'

const argv = minimist(process.argv.slice(2))

function version() {

    console.log(pkg.name + '@' + pkg.version)

}

function usage() {

    console.log('Usage: bulbo [build|serve]')

}

/**
 * Returns if the command is valid.
 * @param {string} commant The command
 * @return {Boolean}
 */
function isCommandValid(command) {

    return /^s|b/.test(command)

}

/**
 * @param {object} argv The minimist parsed object
 */
function main(argv) {

    if (argv.version) {

        version()
        process.exit(0)

    }

    const command = argv._[0] || 'serve'

    if (!isCommandValid(command)) {

        usage()
        process.exit(1)

    }

    new Liftoff({name: 'bulbo', extensions: interpret.jsVariants})

    .on('require', name => { console.log('Requiring external module', chalk.magenta(name)) })

    .on('requireFail', name => { console.error('Failed to load external module', name) })

    .launch({}, env => onLaunch(env, command))

}

/**
 * Liftoff launch handler
 * @param {Object} env Litfoff env object
 * @param {string} command The command
 */
function onLaunch(env, command) {

    if (!env.modulePath) {

        console.log(chalk.red('Error: Local bulbo module not found'))
        console.log('Try running:', chalk.green('npm install bulbo'))

        process.exit(1)

    }

    if (!env.configPath) {

        console.log(chalk.red('Error: No bulbofile found'))

        process.exit(1)

    }

    console.log('Using bulbofile:', chalk.magenta(env.configPath))

    const bulbo = require(env.modulePath)

    require(env.configPath)

    if (bulbo.isEmpty()) {

        console.log(chalk.red('Error: No asset defined in bulbofile'))

        process.exit()

    }

    if (/^b/.test(command)) { // build

        console.log('bulbo build 🔨')

        bulbo.build()

    } else {

        console.log('bulbo serve 🚿')

        bulbo.serve()

    }

}

main(argv)
