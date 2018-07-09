const needle = require('needle');

class APIHandler {
    constructor(client) {
        this.client = client;

        this.tmdb = `https://api.themoviedb.org/3/`;
    }

    _errorResponse(message) {
        return { 'error': message };
    }

    async _get(path, queries) {
        const request = `${this.tmdb}${path}?api_key=${this.client.config.tokens.api.tmdb}${queries ? `&${queries}` : ''}`;

        const { 'body': response } = await needle('get', request)
                                           .catch(this.client.handlers.log.error);

        if (!response || typeof response.success === 'boolean') return this._errorResponse('API.');
        return response;
    }

    async externalID(id) {
        const title = await this._get(`find/${id}`, 'external_source=imdb_id');

        return title.error ? title
               : title.movie_results[0] ? title.movie_results[0].id
               : this._errorResponse('Title not found.');
    }

    async search(query, page) {
        return await this._get(`search/movie`, `query=${query}&page=${page || 1}&include_adult=true`);
    }

    async title(query) {
        const titles = await this.search(query);

        if (titles.error) return titles;
        if (titles.total_results === 0) return this._errorResponse('Cannot find title.');

        const titleID = titles.results[0].id;
        const title = await this._get(`movie/${titleID}`);
        
        return title;
    }
}

module.exports = APIHandler;