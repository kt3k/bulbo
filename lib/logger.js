var zeropad = function (n) {

    return ('0' + n).match(/..$/)[0]

}

var timestamp = function () {

    var date = new Date()

    return [
        zeropad(date.getHours()),
        zeropad(date.getMinutes()),
        zeropad(date.getSeconds())
    ].join(':')
}

/**
 * Logs the given messages with timestamp
 *
 * @param {Array} arguments The messages
 */
module.exports.log = function () {

    var args = Array.prototype.slice.call(arguments)

    args.unshift('[' + timestamp() + ']')

    console.log.apply(console, args)

}
