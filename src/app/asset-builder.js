import vfs from 'vinyl-fs'
import * as drain from '../util/drain'

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

        const stream = this.assets.getMergedStream().pipe(vfs.dest(this.dest)).pipe(drain.obj())

        this.assets.forEach(asset => asset.reflow())

        return new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject))

    }

}
