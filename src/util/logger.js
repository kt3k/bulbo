/**
 * @param {number} n The non negative number less than 100.
 */
function zeropad (n) {
    return ('0' + n).match(/..$/)[0]
}

/**
 * Returns the current timestamp with the format HH:MM:ss
 * @return {string}
 */
function timestamp () {
    const date = new Date()

    return [
        zeropad(date.getHours()),
        zeropad(date.getMinutes()),
        zeropad(date.getSeconds())
    ].join(':')
}

export default {
    /**
     * Logs the given messages with timestamp
     * @param {Array} args The messages
     */
    log (...args) {
        console.log('bulbo [' + timestamp() + ']', ...args)
    }
}
