import {EventEmitter} from 'events'

export const obj = () => {
  const drain = new EventEmitter()
  drain.write = () => {}
  drain.end = function () { this.emit('end') }
  return drain
}
