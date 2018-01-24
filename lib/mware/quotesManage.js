const request = require('request')

const config = require('../model/config')
var watching = require('../model/quotes').watching

const IEX_API_BASE = 'https://api.iextrading.com/1.0/stock'

function getAllQuotes(req, res) {
    res.send(Object.keys(watching))
}

function getQuote(req, res) {
    var quoteName = req.params.quote
    if (!watching[quoteName]) {
        return res.status(404).send('The quote is not being watched')
    }
    res.status(204).send(watching[quoteName])
}

function addQuote(req, res) {
    var quoteName = req.params.quote
    if (watching[quoteName]) {
        return res.status(204).send()
    }
    if (Object.keys(watching).length >= config.QUOTE_IIMIT) {
        return res.status(403).send('Number of watching stocks exceeded quota ' + config.QUOTE_IIMIT)
    }

    var verifyUrl = getIexApiCompany(quoteName)
    request.get(verifyUrl, (err, resp, body) => {
        if (err) {
            logger('[ERROR] get ${verifyUrl}: ' + err)
        }
        if (err || resp.statusCode < 200 || resp.statusCode >= 300) {
            return res.status(404).send(`Quote ${quoteName} does not exist in our data source`)
        }
        watching[quoteName] = {}
        res.status(204).send('Number of watching stocks exceeded quota ' + config.QUOTE_IIMIT)
    })
}

function removeQuote(req, res) {
    var quoteName = req.params.quote
    if (!watching[quoteName]) {
        return res.status(404).send('The quote is not being watched')
    }

    delete watching[quoteName]
    res.status(204).send()
}


function getIexApiCompany(quote) {
    return `${IEX_API_BASE}/${quote}/company` 
}

module.exports = {
    getAllQuotes: getAllQuotes,
    getQuote: getQuote,
    addQuote: addQuote,
    removeQuote: removeQuote
}
