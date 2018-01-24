const express = require('express')
const request = require('request')

const app = express()

const QUOTE_IIMIT = 5
const PORT = 4080
const QUOTE_REGEX =  /^[a-zA-Z0-9-.]{1,10}$/    // alphanumeric, dash, dot, 1 to 10 chars

const IEX_API_BASE = 'https://api.iextrading.com/1.0/stock'

var watching = {}

// app.use(express.bodyParser())
app.use((req, res, next) => {
    logger(`${req.method} ${req.url}`)
    next()
})
app.param('quote', (req, res, next, quoteParam) => {
    if (!QUOTE_REGEX.test(quoteParam)) {
        return res.status(400).send('Invalid quote ' + quoteParam)
    }
    req.params.quote = quoteParam.toLowerCase()
    next()
})

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

    var verifyUrl = getIexApiCompany(quoteName)
    request.get(verifyUrl, (err, resp, body) => {
        if (err) {
            logger('[ERROR] get ${verifyUrl}: ' + err)
        }
        if (err || resp.statusCode < 200 || resp.statusCode >= 300) {
            return res.status(404).send(`Quote ${quoteName} does't exist in our data source`)
        }
        watching[quoteName] = {}
        res.status(204).send('Number of watching stocks exceeded quota ' + QUOTE_IIMIT)
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

function logger(content) {
    var logTime = new Date().toISOString()
    console.log(`${logTime} ${content}`)
}

app.listen(PORT, () => console.log('Listening on port ' + PORT))
