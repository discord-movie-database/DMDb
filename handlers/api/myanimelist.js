const APITemplate = require('./template');

class MyAnimeList extends APITemplate {
    constructor(client) {
        super(client);

        this.base = 'https://api.jikan.moe/v3/';
    }

    /**
     * Get data from MyAnimeList API with endpoint and parameters
     * 
     * @param {string} endpoint location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} API response
     */
    async get(endpoint, params) {
        return await this._get(this.base, endpoint, params, false);
    }

    async getResults(endpoint, params) {
        const results = await this.get(endpoint, params);

        console.log(results.results.length);

        return results;
    }

    /**
     * Get simple data about multiple movies with a query
     * 
     * @param {string} flags Movie name & parameters
     * @returns {object} Error or movies
     */
    async getAnimes(flags) {
        const animes = await this.getResults('search/anime', {
            q: flags.query });

        return animes;
    }
}

module.exports = MyAnimeList;