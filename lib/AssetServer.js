'use strict'

var subclass = require('subclassjs')
var vinylServe = require('vinylServe')

var AssetServer = subclass(function (pt) {

    pt.constructor = function (assets, port) {

        this.assets = assets
        this.port = port

    }

    pt.start = function () {

        return this.assets.getMergedWatchStream().pipe(vinylServe(this.port))

    }

})

module.exports = AssetServer
