'use strict'

var watch = require('./watch')
var logger = require('./logger')
var chalk = require('chalk')
var subclass = require('subclassjs')
var vinylServe = require('vinyl-serve')

vinylServe.setDebugPageTitle('Welcome to <i>Bulbo</i> asset path debug page!')
vinylServe.setDebugPagePath('/__bulbo__')

var AssetServer = subclass(function (pt) {

    /**
     * @param {AssetCollection} assets The assets
     * @param {Number} port The port number
     */
    pt.constructor = function (assets, port) {

        this.assets = assets
        this.port = port

    }

    /**
     * Serves, watching paths for assets.
     *
     * @param {Function} cb The callback
     */
    pt.serve = function (cb) {

        var self = this

        this.assets.forEach(function (asset) {

            watch(asset.getWatchPath(), asset.getWatchOpts(), function () {

                logger.log('❗️ File changed:', chalk.magenta(asset.glob))

                asset.pipe(vinylServe(self.port)).on('end', function () {

                    logger.log('✅ Files ready:', chalk.magenta(asset.glob))

                })

            })

        })

        this.assets.getMergedStream().pipe(vinylServe(this.port)).on('end', function () {

            logger.log('✅ All files ready')

        })

        if (typeof cb === 'function') {

            vinylServe.getInstance(this.port)
                .startPromise
                .then(function () { cb(null) })
                .catch(function (err) { cb(err) })

        }

    }

})

module.exports = AssetServer
