const quotesQueue = require('../model/quotes')

function getAllQuotes(req, res) {
    res.status(200).send(quotesQueue.getAllQuotes())
}

function getQuote(req, res) {
    if (!quotesQueue.getQuote(req.params.quote)) {
        return res.status(404).send('The quote is not being watched')
    }
    // TODO: add info
    res.status(204).send()
}

function addQuote(req, res) {
    quotesQueue.addQuote(req.params.quote, (err, message) => {
        if (err) {
            return res.status(err).send(message)
        } else {
            return res.status(204).send()
        }
    })
}

function removeQuote(req, res) {
    quotesQueue.removeQuote(req.params.quote, (err) => {
        if (err) {
            return res.status(404).send('The quote is not being watched')
        } else {
            return res.status(204).send()
        }
    })
}

module.exports = {
    getAllQuotes: getAllQuotes,
    getQuote: getQuote,
    addQuote: addQuote,
    removeQuote: removeQuote
}
