const liftoff = require('../liftoff')

/**
 * The serve action.
 * @param {Logger} logger The logger
 * @param {boolean} w The watch flag
 * @param {boolean} watch The watch flag
 */
module.exports = ({w, watch}) => {
  liftoff('bulbo').then(bulbo => {
    if (w || watch) {
      bulbo.watchAndBuild()
    } else {
      bulbo.build()
    }
  })
}
