const liftoff = require('../liftoff')

/**
 * The serve action.
 */
module.exports = () => {
  liftoff('bulbo').then(bulbo => {
    bulbo.serve()
  })
}
