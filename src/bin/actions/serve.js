const liftoff = require('../liftoff')

/**
 * The serve action.
 */
module.exports = ({logger}) => {
  liftoff(logger).then(bulbo => {
    bulbo.serve()
  })
}
