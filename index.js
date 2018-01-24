const express = require('express')

const quotesMware = require('./lib/mware/quotesManage')
const config = require('./lib/model/config')

const app = express()

// app.use(express.bodyParser())
app.use((req, res, next) => {
    logger(`${req.method} ${req.url}`)
    next()
})
app.param('quote', (req, res, next, quoteParam) => {
    if (!config.QUOTE_FORMAT.test(quoteParam)) {
        return res.status(400).send('Invalid quote ' + quoteParam)
    }
    req.params.quote = quoteParam.toLowerCase()
    next()
})

app.get('/v1/stocks/', quotesMware.getAllQuotes)
app.get('/v1/stocks/:quote/', quotesMware.getQuote)
app.post('/v1/stocks/:quote/', quotesMware.addQuote)
app.delete('/v1/stocks/:quote/', quotesMware.removeQuote)

function logger(content) {
    var logTime = new Date().toISOString()
    console.log(`${logTime} ${content}`)
}

app.listen(config.PORT, () => console.log('Listening on port ' + config.PORT))
