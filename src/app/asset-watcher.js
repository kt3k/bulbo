const {EventEmitter} = require('events')

class AssetWatcher extends EventEmitter {
  /**
   * @param {AssetCollection} assets The assets
   */
  constructor (assets) {
    super()

    this.assets = assets
  }

  /**
   * Watches all the assets and pipes everything into the given writable
   * @param {Writable} writable The writable
   */
  watchAndPipe (writable) {
    this.assets.forEach(asset => {
      asset.getStream().pipe(writable)

      asset.watch(() => {
        this.emit('changed', asset)

        asset.reflow({end: false}, () => this.emit('ready', asset))
      })

      this.emit('reading', asset)

      asset.reflow({end: false}, () => this.emit('ready', asset))
    })
  }

  /**
   * Unwatches the assets
   */
  unwatch () {
    this.assets.forEach(asset => asset.unwatch())
  }
}

module.exports = AssetWatcher
