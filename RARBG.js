const axios = require('axios')

module.exports = class {
    constructor(appName) {
        this.appName = appName;
    }
    async getToken() {
        const {data} = await axios.get('https://torrentapi.org/pubapi_v2.php', {
            params: {
                get_token: 'get_token',
                app_id: this.appName
            }
        })
        return data.token;
    }
    async search({name, season = 1, episode = 1, resolution = 720, limit = 5, category = 'tv'}) {
        try {
            if (this.token == undefined) this.token = await this.getToken()
            return (await axios.get('https://torrentapi.org/pubapi_v2.php', {
                params: {
                    app_id: this.appName,
                    token: this.token,
                    category: this.resolveCategories(category),
                    search_string: this.generateSearch(name, season, episode, resolution),
                    mode: 'search',
                    sort: 'seeders',
                    limit
                }
            })).data
        } catch (e) {
            console.log(e)
        }
    }
    generateSearch(name, season, episode, resolution) {
        season = season.toString()
        episode = episode.toString()
        resolution = resolution.toString()
        return `${name} S${season.padStart(2, '0')}E${episode.padStart(2, '0')} ${resolution}p`
    }
    resolveCategories(type) {
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