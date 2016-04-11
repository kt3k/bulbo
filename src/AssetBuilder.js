import vfs from 'vinyl-fs'
import through from 'through'

export default class AssetBuilder {

    /**
     * @constructor
     * @param {AssetCollection} assets The assets
     * @param {String} dest The destination
     */
    constructor(assets, dest) {

        this.assets = assets
        this.dest = dest

    }

    /**
     * Builds the assets
     *
     * @param {Function} cb The callback
     * @return {Stream}
     */
    build(cb) {

        const stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest)).pipe(through())

        if (typeof cb === 'function') {

            stream
                .on('end', () => { cb(null) })
                .on('error', e => { cb(e) })

        }

        return stream

    }

}
