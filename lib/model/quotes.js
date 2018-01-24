const request = require('request')

const Watch = require('./watch')
const config = require('./config')
const logger = require('../../util/logger')

const LOWER_LIMIT = 0
const HIGHER_LIMIT = 5
const IEX_API_BASE = 'https://api.iextrading.com/1.0/stock'

function getIexApiCompany(quote) {
    return `${IEX_API_BASE}/${quote}/company` 
}

class Quotes {
    constructor(limit) {
        if (limit < LOWER_LIMIT) {
            limit = LOWER_LIMIT
        } else if (limit > HIGHER_LIMIT) {
            limit = HIGHER_LIMIT
        }
        this.limit = limit
        this.watching = {}
    }

    getQuote(quoteName) {
        return this.watching[quoteName]
    }

    getAllQuotes(quoteName) {
        return Object.keys(this.watching)
    }

    addQuote(quoteName, callback) {
        if (this.watching.hasOwnProperty(quoteName)) {
            return callback(null)
        }
        if (Object.keys(this.watching).length >= this.limit) {
            return callback(403, 'Number of watching stocks exceeded quota ' + this.limit)
        }

        const verifyUrl = getIexApiCompany(quoteName)
        request.get(verifyUrl, (err, resp, body) => {
            if (err) {
                logger(`[ERROR] get ${verifyUrl}: ${err}`)
            }
            if (err || resp.statusCode < 200 || resp.statusCode >= 300) {
                return callback(404, `Quote ${quoteName} does not exist in our data source`)
            }

            this.watching[quoteName] = new Watch(quoteName)
            this.watching[quoteName].watch()
            return callback(null)
        })
    }

    removeQuote(quoteName, callback) {
        if (!this.watching[quoteName]) {
            return callback(404)
        }

        this.watching[quoteName].stop()
        delete this.watching[quoteName]

        return callback(null)
    }
}

// TODO use static data for now, need a better way. need persistency
let staticQuotes = new Quotes(config.QUOTE_IIMIT)

module.exports = staticQuotes
