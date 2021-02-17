const express = require('express')
const app = express();
const RARBG = require('./RARBG')

const rarbg = new RARBG('DST');
app.use(require('body-parser').json())
app.set('view engine', 'ejs')
require('dotenv').config()

rarbg.search({name: 'WandaVision'}).then(e => console.log(e))

app.get('/', (req, res) => {
    res.render('./index.ejs')
})

app.post('/torrents', (req, res) => {
    console.log(req.body)
})

app.listen(process.env.PORT || 8080)