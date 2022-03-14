const bulbo = require("../../");
const chalk = require("chalk");

/**
 * The serve action.
 */
module.exports = () => {
  bulbo.cli.liftoff("bulbo").then(({ module: bulbo }) => {
    if (bulbo.isEmpty()) {
      bulbo.logger.log(chalk.red("Error: No asset defined"));

      process.exit(1);
    }

    bulbo.serve();
  });
};
