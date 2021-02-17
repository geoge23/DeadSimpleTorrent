const express = require('express')
const app = express();
const RARBG = require('./RARBG')
const torrents = {}

const rarbg = new RARBG('DST');
app.use(require('body-parser').json())
app.set('view engine', 'ejs')
require('dotenv').config()


app.get('/', (req, res) => {
    res.render('./index.ejs')
})

app.post('/torrents', async (req, res) => {
    const body = req.body;
    const search = await rarbg.search({
        name: body.name,
        category: body.category,
        episode: body.episode || 1,
        season: body.season || 1,
        res: this.res
    })
    if (search instanceof Array) search.forEach(({filename, download}) => {
        torrents[filename] = download;
    })
    res.status(200).send(search)
})

app.post('/download', async (req, res) => {
    const magnet = torrents[req.body.name]
    res.status(200).send()
})

app.listen(process.env.PORT || 8080)