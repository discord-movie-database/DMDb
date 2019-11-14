import UtilStructure from '../structures/util';

import MovieEndpoint from '../tmdb/movie';
import TVEndpoint from '../tmdb/tv';
import PersonEndpoint from '../tmdb/person';
import SearchEndpoint from '../tmdb/search';
import FindEndpoint from '../tmdb/find';

/**
 * TMDb API wrapper.
 * 
 * @prop {Object} client - DMDb client extends Eris
 * @prop {Object} movie - Movie endpoint
 * @prop {Object} tv - TV endpoint
 * @prop {Object} person - Person endpoint
 * @prop {Object} search - Search endpoint
 * @prop {Object} find - Find endpoint
 * @prop {string} base - API base URL
 */
class TMDb extends UtilStructure {
    /**
     * Create TMDb API wrapper.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.movie = new MovieEndpoint(this);
        this.tv = new TVEndpoint(this);
        this.person = new PersonEndpoint(this);
        this.search = new SearchEndpoint(this);
        this.find = new FindEndpoint(this);

        this.base = 'https://api.themoviedb.org/3';
    }

    /**
     * Create error object.
     * 
     * @param {string} message - Error message
     * @returns {Object} - Error object
     */
    error(message) {
        return { error: message };
    }

    /**
     * Get data from API.
     * 
     * @param {string} endpoint - API endpoint
     * @param {Object} options - API options
     * @returns {Promise<Object>} - API response
     */
    async getEndpoint(endpoint, options) {
        // Set default settings
        options = Object.assign({
            language: 'en', 
            region: 'us',
            api_key: this.client.config.tokens.tmdb,
        }, options);

        // Try and get data from API
        try {
            const { data: response } = await this.client.axios({
                method: 'GET',
                url: this.base + endpoint,
                params: options,
            });

            return response;
        } catch (error) { // API error
            this.client.log.error(error);

            return this.error('API Error. Try again later.');
        }
    }

    /**
     * Get TMDb ID.
     * 
     * @param {string} query - Query
     * @param {Object} sources - External resources
     * @param {string} media - Media type
     * @param {boolean} details - Include extra information?
     * @returns {(Promise<Object> | Object | string)} - TMDb ID
     */
    async getID(query, sources, media, details) {
        const isTMDb = query.match(/^(t)(\d+)$/);

        // Is a TMDb id.
        if (isTMDb) {
            const index = isTMDb[2];

            return details ? this[media].details(index) : index;
        }

        // Is an external id.
        for (let sourceName in sources) {
            const validation = sources[sourceName];
            const mediaObject = `${media}_results`;

            const isExternal = query.match(validation);

            if (isExternal) {
                const response = await this.find.ID(query, { external_source: sourceName });
                if (response.error) return response;

                if (response[mediaObject].length > 0) {
                    return details ? response[mediaObject][0] : response[mediaObject][0].id;
                } else {
                    return this.error('External source not found or not in TMDb database.');
                }
            }
        }

        // Is not an id.
        const response = await this.search[media](query);
        if (response.error) return response;

        if (response.results.length > 0) {
            return details ? response.results[0] : response.results[0].id;
        } else {
            return this.error('No results found.');
        }
    }

    /**
     * Reduce results from 20 to 5 per page.
     * 
     * @param {string} endpoint - Endpoint to get results from
     * @param {Object} options - API options
     * @param {boolean} queryRequired - Query required?
     * @returns {Promise<Object>} - Updated results
     */
    async mutateResults(endpoint, options, queryRequired) {
        if (queryRequired & !options.query) return this.error('Query required.');

        const inputPage = options.page >= 1 ? options.page : 1;
        if (inputPage > 4000) return this.error('Page must be less than or equal to 4000.');

        options.page = Math.ceil(inputPage / 4);

        const response = await this.getEndpoint(endpoint, options);
        if (response.error) return response;

        response.page = inputPage;

        response.results.total_pages = Math.ceil(response.total_results / 5);
        if (response.results.total_pages < inputPage) return this.error('No results found.');

        const pageOffset = (inputPage - 1) % 4 * 5;

        response.results = response.results.slice(pageOffset, pageOffset + 5);
        response.results = response.results.map((result, index) => {
            return { ...result, index: (options.page - 1) * 20 + pageOffset + index + 1 } });

        return response;
    }
}

export default TMDb;
