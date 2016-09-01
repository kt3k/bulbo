import {Stream} from 'stream'

/**
 * This is taken from event-stream npm module.
 *
 * Merges the given streams into a new stream.
 *
 * @param {Stream[]) toMerge streams to be merged
 */
export default function mergeStream (toMerge) {
    const stream = new Stream()

    stream.setMaxListeners(0) // allow adding more than 11 streams

    let endCount = 0

    stream.writable = stream.readable = true

    toMerge.forEach(e => {
        e.pipe(stream, {end: false})

        let ended = false

        e.on('end', () => {
            if (ended) {
                return
            }

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

    return stream
}
