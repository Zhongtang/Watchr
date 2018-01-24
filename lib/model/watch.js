const request = require('request')

const logger = require('../../util/logger')

const IEX_API_BASE = 'https://api.iextrading.com/1.0/stock'
const POLL_INTERVAL = 10 * 1000  // 10 seconds

function getIexApiQuote(quote) {
    // e.g. https://api.iextrading.com/1.0/stock/aapl/quote
    return `${IEX_API_BASE}/${quote}/quote` 
}

function fakeAlert(content) {
    logger(`Alert is not implemented. But if I was, I will say this: ${content}`)
}

// class Watch is the full poll-check-alert sequence for a quote
// a Watch obj should be instantiated for each of the quotes to watch
class Watch {
    constructor(quote) {
        this.quote = quote
        this.monitors = {}
    }

    addMonitor(monitor) {
        // dedup based on the describe() result
        const monitorKey = monitor.describe()
        if (this.monitors[monitorKey]) {
            return false
        }
        this.monitors[monitorKey] = monitor
    }

    poll(callback) {
        const quoteUrl = getIexApiQuote(this.quote)
        request.get(quoteUrl, (err, resp, body) => {
            // TODO: halt polling on error
            if (err || resp.statusCode < 200 || resp.statusCode >= 300) {
                return callback(new Error(`[ERROR] poll ${quoteUrl}: ${err}, ${resp.statusCode}, ${body}`))
            }

            try {
                var parsedBody = JSON.parse(body)
            } catch (ex) {
                return callback(new Error(`[ERROR] poll failed to parse body ${body}: ${ex}`))
            }

            if (!parsedBody.hasOwnProperty('symbol') || !parsedBody.hasOwnProperty('latestPrice') || !parsedBody.hasOwnProperty('latestTime')) {
                console.log('xxx', typeof parsedBody, parsedBody.symbol, parsedBody.latestPrice, parsedBody.latestTime)
                return callback(new Error(`[ERROR] poll ${quoteUrl}: ${err}, ${resp.statusCode}, ${parsedBody}`))
            }
            callback(null, { symbol: parsedBody.symbol, price: parsedBody.latestPrice, time: parsedBody.latestTime })
        })
    }

    watch() {
        let that = this

        let watchSequence = function () {
            that.poll((err, data) => {
                if (err) {
                    return logger(err)
                }

                let monitorResults = {}
                Object.keys(that.monitors).forEach((monitorId) => {
                    let monitor = that.monitors[monitorId]
                    if (monitor.check(data)) {
                        monitorResults[monitorId] = monitor.describe(data)
                    }
                    if (monitor.expiry()) {
                        delete that.monitors[monitorId]
                    }
                })
                logger("[DEBUG] poll data: " + JSON.stringify(data))

                // TODO: switch to object.values with higher nodejs version
                Object.keys(monitorResults).forEach((resultId) => {
                    fakeAlert(monitorResults[resultId])
                })
            })
        }

        this.watchRef = setInterval(watchSequence, POLL_INTERVAL)
    }

    stop() {
        clearInterval(this.watchRef)
    }
}

module.exports = Watch
