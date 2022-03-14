"use strict";

const Splicer = require("stream-splicer");

/**
 * This represents linear pipeline of the series of the duplex streams.
 */
class Pipeline extends Splicer {
  /**
   * @param {Duplex[]} streams The duplex streams
   * @param {object} opts The options
   */
  constructor(streams, opts = {}, objectMode = false) {
    opts.objectMode = objectMode;
    super(streams, opts);

    this.version = 0;

    this.on("data", (_data) => {
      this.version = this.version + 1;

      const version = this.version;

      if (this.totalBufferLength() === 0) {
        setTimeout(() => {
          if (version === this.version) {
            this.emit("buffer-empty");
          }
        }, 200);
      }
    });
  }

  /**
   * Returns the length of the readable buffer.
   * @param {Readable} pipe The readable stream
   * @return {number}
   */
  static getBufferLength(pipe) {
    let length = 0;

    if (
      pipe._readableState != null &&
      typeof pipe._readableState.length === "number"
    ) {
      // Adds readable buffer length
      length += pipe._readableState.length;
    }

    if (
      pipe._writableState != null &&
      typeof pipe._readableState.getBuffer === "function"
    ) {
      // Adds writable buffer length
      length += pipe._writableState.getBuffer().length;
    }

    return length;
  }

  /**
   * Returns the total buffer length in the pipeline.
   * @return {number}
   */
  totalBufferLength() {
    return this._streams.map((pipe) => Pipeline.getBufferLength(pipe))
      .reduce((x, y) => x + y);
  }

  /**
   * Factory method for Pipeline which creates it in object mode.
   * @param {Duplex[]} streams The duplex streams
   * @return {Pipeline}
   */
  static obj(streams, opts) {
    return new Pipeline(streams, opts, true);
  }
}

module.exports = Pipeline;
