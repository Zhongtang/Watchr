const express = require('express')
const app = express()

const QUOTE_IIMIT = 5
const PORT = 4080
var watching = {}

app.get('/v1/stocks/', getAllQuotes)
app.get('/v1/stocks/:quote/', getQuote)
app.post('/v1/stocks/:quote/', addQuote)
app.delete('/v1/stocks/:quote/', removeQuote)


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
    if (Object.keys(watching).length >= QUOTE_IIMIT) {
        return res.status(403).send('Number of watching stocks exceeded quota ' + QUOTE_IIMIT)
    }

    watching[quoteName] = {}
    res.status(204).send('Number of watching stocks exceeded quota ' + QUOTE_IIMIT)
}

function removeQuote(req, res) {
    var quoteName = req.params.quote
    if (!watching[quoteName]) {
        return res.status(404).send('The quote is not being watched')
    }

    delete watching[quoteName]
    res.status(204).send()
}

app.listen(PORT, () => console.log('Listening on port ' + PORT))
