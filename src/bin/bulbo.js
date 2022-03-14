const chalk = require("chalk");
const minimisted = require("minimisted");
const minirocket = require("minirocket");

const usage = require("./usage");

/**
 * @param {boolean} argv.v The version flag
 * @param {boolean} argv.version The version flag
 * @param {boolean} argv.h The help flag
 * @param {boolean} argv.help The help flag
 * @param {string} argv._.0 The action name
 */
minimisted((argv) => {
  const { v, version, h, help, _: [action] } = argv;

  minirocket({
    version: v || version,
    help: h || help,
    serve: !action,
    [action]: true,
  }, (action) => {
    action(argv);
  }).on("no-action", (name) => {
    console.log(chalk.red(`Error: No such action: ${name}`));
    usage();
    process.exit(1);
  });
});
