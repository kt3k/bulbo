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

        this.assets.pipeAll(vfs.dest(this.dest))
        this.assets.pipeAll(drain.obj())

        this.assets.reflowAll()

        return this.assets.isAllReady()

    }

}
