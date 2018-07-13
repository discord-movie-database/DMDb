const needle = require('needle');

class APIHandler {
    constructor(client) {
        this.client = client;

        // API Endpoint.
        this.tmdb = `https://api.themoviedb.org/3/`;
    }

    async _get(path, queries) {
        // Format queries.
        if (queries) queries = Object.keys(queries).map(query =>
            `&${query}=${queries[query]}`).join('');

        // Request.
        const request = `${this.tmdb}\
${path}\
?api_key=${this.client.config.tokens.api.tmdb}\
${queries ? queries : ''}`;

        // POST.
        const { 'body': response } = await needle('get', request)
            .catch(this.client.handlers.log.error);
        
        // Response.
        if (!response || response.success === false)
            return { 'error': 'API is having issues.' };
        return response;
    }

    async search(query, page) {
        // Get movies from API.
        return this._get(`search/movie`, {
            'query': query,
            'page': page || 1,
            'include_adult': true
        });
    }
}

module.exports = APIHandler;