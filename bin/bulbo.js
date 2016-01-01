#! /usr/bin/env node
'use strict'

var interpret = require('interpret')
var Liftoff = require('liftoff')
var argv = require('minimist')(process.argv.slice(2))
var pkg = require('../package')

var version = function () {

    console.log(pkg.name + '@' + pkg.version)

}

var usage = function () {

    console.log('Usage: bulbo [build|serve]')

}

if (argv.version) {

    version()
    process.exit(0)

}

var command = argv._[0] || 'serve'

if (!/^(s|b)/.test(command)) {

    usage()
    process.exit(1)

}

var cli = new Liftoff({

    name: 'bulbo',
    extensions: interpret.jsVariants

}).on('require', function(name) {

    console.log('Requiring external module', name);

}).on('requireFail', function(name) {

    console.error('Failed to load external module', name);

}).launch({}, function (env) {

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

    } else if (/^s/.test(command)) { // serve

        console.log('bulbo serve')

        bulbo.serve()

    }

})
