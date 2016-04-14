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
     * @return {Promise}
     */
    build() {

        const stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest)).pipe(through())

        return new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject))

    }

}
