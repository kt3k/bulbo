/**
 * The build action.
 */
module.exports = ({bulbo, w, watch}) => {
  if (w || watch) {
    bulbo.watchAndBuild()
  } else {
    bulbo.build()
  }
}
