'use strict'

var Stream = require('stream').Stream

/**
 * This is taken from event-stream npm module.
 *
 * Merges the given streams into a new stream.
 *
 * @param {Stream[]) toMerge streams to be merged
 */
var mergeStream = function (toMerge) {

    var stream = new Stream()

    stream.setMaxListeners(0) // allow adding more than 11 streams

    var endCount = 0

    stream.writable = stream.readable = true

    toMerge.forEach(function (e) {

        e.pipe(stream, {end: false})

        var ended = false

        e.on('end', function () {

            if (ended) { return }

            ended = true
            endCount++

            if (endCount === toMerge.length) {
                stream.emit('end')
            }

        })

    })

    stream.write = function (data) {

        this.emit('data', data)

    }

    stream.destroy = function () {

        toMerge.forEach(function (e) {

            if (e.destroy) { e.destroy() }

        })

    }

    return stream

}

module.exports = mergeStream
