const axios = require('axios')

module.exports = class {
    constructor(appName) {
        this.appName = appName;
    }
    async _getToken() {
        const {data, headers} = await axios.get('https://torrentapi.org/pubapi_v2.php', {
            params: {
                get_token: 'get_token',
                app_id: this.appName
            }
        })
        await this._wait(200)
        return data.token;
    }
    _wait(time) {
        return new Promise((res, _) => {
            setTimeout(() => res(), time)
        })
    }
    async search({name, season = 1, episode = 1, res = 720, limit = 5, category = 'tv'}) {
        try {
            if (this.token == undefined) this.token = await this._getToken()
            let data = (await axios.get('https://torrentapi.org/pubapi_v2.php', {
                params: {
                    app_id: this.appName,
                    token: this.token,
                    category: this._resolveCategories(category),
                    search_string: this._generateSearch(name, season, episode, res, category),
                    mode: 'search',
                    sort: 'seeders',
                    limit
                }
            })).data
            if (data.torrent_results) {
                return data.torrent_results
            } else {
                return data
            }
        } catch (e) {
            console.log(e)
        }
    }
    _generateSearch(name, season, episode, resolution, category) {
        season = season.toString()
        episode = episode.toString()
        resolution = resolution.toString()
        if (category == 'movie') {
            return `${name} ${resolution}p`
        } else {
            return `${name} S${season.padStart(2, '0')}E${episode.padStart(2, '0')} ${resolution}p`
        }
    }
    _resolveCategories(type) {
        switch (type) {
            case 'tv':
                return '1;18;41;49'
            case 'movie':
                return '14;48;17;50;47;45;44;51;52;42;46;54'
            default: 
                throw new Error('Invalid media type')
        }
    }
}