#! /usr/bin/env node
'use strict'

var interpret = require('interpret')
var Liftoff = require('liftoff')
var argv = require('minimist')(process.argv.slice(2))
var pkg = require('../package')

var command

var version = function () {

    console.log(pkg.name + '@' + pkg.version)

}

var usage = function () {

    console.log('Usage: bulbo [build|serve]')

}

/**
 * Returns if the command is valid
 *
 * @return {Boolean}
 */
var isCommandValid = function (command) {

    return /^s|b/.test(command)

}

var main = function () {

    if (argv.version) {

        version()
        process.exit(0)

    }

    command = argv._[0] || 'serve'

    if (!isCommandValid(command)) {

        usage()
        process.exit(1)

    }

    new Liftoff({

        name: 'bulbo',
        extensions: interpret.jsVariants

    }).on('require', function (name) {

        console.log('Requiring external module', name)

    }).on('requireFail', function (name) {

        console.error('Failed to load external module', name)

    }).launch({}, onLaunch)

}

/**
 * Liftoff launch handler
 *
 * @param {Object} env Litfoff env object
 */
var onLaunch = function (env) {

    if (!env.modulePath) {

        console.log('Error: Local bulbo module not found')
        console.log('Try running: npm install bulbo')

        process.exit(1)

    }

    if (!env.configPath) {

        console.log('Error: No bulbofile found')

        process.exit(1)

    }

    console.log('Using bulbofile', env.configPath)

    var bulbo = require(env.modulePath)

    require(env.configPath)

    if (bulbo.isEmpty()) {

        console.log('Error: No asset defined in bulbofile')

        process.exit()

    }

    if (/^b/.test(command)) { // build

        console.log('bulbo build')

        bulbo.build()

    }

    console.log('bulbo serve')

    bulbo.serve()

}

main()
