'use strict'

const Splicer = require('stream-splicer')

/**
 * This represents linear pipeline of the series of the duplex streams.
 */
class Pipeline extends Splicer {

    /**
     * @param {Duplex[]} streams The duplex streams
     * @param {object} opts The options
     */
    constructor(streams, opts = {}, objectMode = false) {
        opts.objectMode = objectMode
        super(streams, opts)

        this.version = 0

        const ondata = () => {

            // console.log('ondata length', this.totalBufferLength(), 'version', this.version)

            this.version++;

            const lastVersion = this.version

            if (this.totalBufferLength() === 0) {

                setTimeout(() => {

                    if (lastVersion === this.version) {

                        // console.log('ondata buffer-empty version:', this.version)
                        this.emit('buffer-empty')

                    }

                }, 300)
            }
        }

        this
        .on('data', ondata)
        .on('end', () => {
            // console.log('end buffer-empty');
            this.emit('buffer-empty')
        })
    }

    /**
     * Returns the length of the readable buffer.
     * @param {Readable} pipe The readable stream
     * @return {number}
     */
    static getBufferLength(pipe) {
        if (pipe._readableState != null && typeof pipe._readableState.length === 'number') {
            return pipe._readableState.length
        }

        // if it doesn't seem Readable type, then returns 0 for now
        return 0
    }

    /**
     * Returns the total buffer length in the pipeline.
     * @return {number}
     */
    totalBufferLength() {

        const length = this._streams.map(pipe => Pipeline.getBufferLength(pipe))
            .reduce((x, y) => x + y)

        return length

    }

    /**
     * Factory method for Pipeline which creates it in object mode.
     * @param {Duplex[]} streams The duplex streams
     * @return {Pipeline}
     */
    static obj(streams, opts) {

        return new Pipeline(streams, opts, true)

    }

}

module.exports = Pipeline
