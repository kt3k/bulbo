import {Transform} from 'stream'
export const obj = () => {

    const through = new Transform({objectMode: true})
    through._transform = (chunk, enc, cb) => cb(null, chunk)

    return through

}
