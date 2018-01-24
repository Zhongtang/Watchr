module.exports = function logger(content) {
    var logTime = new Date().toISOString()
    console.log(`${logTime} ${content}`)
}
