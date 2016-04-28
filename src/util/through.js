import {Transform} from 'stream'

export const obj = (emptyDur = 400) => {

    const through = new Transform({objectMode: true})
    through._transform = (chunk, enc, cb) => cb(null, chunk)

    let checking = false
    let version = 0

    through.emptyCheck = () => {

        if (checking) return

        checking = true

        const ondata = () => {
            const currentVersion = ++version
            setTimeout(() => {
                if (version === currentVersion) {
                    through.emit('feeling-empty', emptyDur)
                    through.removeListener('data', ondata)
                    checking = false
                }
            }, emptyDur)
        }

        through.on('data', ondata)

    }

    return through

}
