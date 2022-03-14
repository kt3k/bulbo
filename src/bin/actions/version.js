const pkg = require("../../../package");

module.exports = () => console.log(pkg.name + "@" + pkg.version);
