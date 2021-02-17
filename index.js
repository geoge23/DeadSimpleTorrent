const { default: axios } = require('axios');
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
    if (search instanceof Array) search.forEach(({filename: name, download}) => {
        torrents[name] = {download, name, category: body.category};
    })
    res.status(200).send(search)
})

app.post('/download', async (req, res) => {
    try {
        const {download, name, category} = torrents[req.body.name]
        await axios({
            method: 'POST',
            url: process.env.TRANSMISSION_URL,
            data: {
                "method": "torrent-add",
                "arguments": {
                    "paused": false,
                    "download-dir": generateDownloadDir(name, category),
                    "filename": download
                }
            },
            headers: {
                'x-transmission-session-id': await getSessionID()
            },
            auth: {
                username: process.env.TRANSMISSION_USERNAME,
                password: process.env.TRANSMISSION_PASSWORD,
            }
        })
        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

function generateDownloadDir(name, category) {
    let path = '';
    if (category == 'tv') {
        name = name.split('.S')
        path += name[0]
        path += '/S'
        path += name[1].split('E')[0]
    } else {
        path = 'tv'
    }
    return `/data/completed/${category}/${path}`;
}

async function getSessionID() {
    try {
        return (await axios({
            method: 'POST',
            url: process.env.TRANSMISSION_URL,
            auth: {
                username: process.env.TRANSMISSION_USERNAME,
                password: process.env.TRANSMISSION_PASSWORD,
            }
        })).headers['x-transmission-session-id']
    } catch (e) {
        return e.response.headers['x-transmission-session-id']
    }
}

app.listen(process.env.PORT || 8080)