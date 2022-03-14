const { EventEmitter } = require("events");

exports.obj = () => {
  const drain = new EventEmitter();
  drain.write = () => {};
  drain.end = function () {
    this.emit("end");
  };
  return drain;
};
