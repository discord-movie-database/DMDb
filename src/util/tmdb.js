import UtilStructure from '../structures/util';

import MovieEndpoint from '../tmdb/movie';
import TvEndpoint from '../tmdb/tv';
import PersonEndpoint from '../tmdb/person';
import SearchEndpoint from '../tmdb/search';
import FindEndpoint from '../tmdb/find';

/**
 * TMDb API wrapper.
 * 
 * @prop {Object} movie Movie endpoint
 * @prop {Object} tv TV endpoint
 * @prop {Object} person Person endpoint
 * @prop {Object} search Search endpoint
 * @prop {Object} find Find endpoint
 * @prop {string} base API base URL
 */
class TMDb extends UtilStructure {
    /**
     * Create TMDb API wrapper.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.movie = new MovieEndpoint(this);
        this.tv = new TvEndpoint(this);
        this.person = new PersonEndpoint(this);
        this.search = new SearchEndpoint(this);
        this.find = new FindEndpoint(this);

        this.base = 'https://api.themoviedb.org/3';
    }

    /**
     * Creates error object.
     * 
     * @param {string} message Error message
     * @returns {Object} Error object
     */
    error(message) {
        return { error: message };
    }

    /**
     * Get data from API.
     * 
     * @param {string} endpoint API endpoint
     * @param {Object} options Request options
     * @returns {Object} API response
     */
    async getEndpoint(endpoint, options) {
        // Set default settings
        options = Object.assign({
            language: 'en', 
            region: 'en',
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
     * Gets TMDb id.
     * 
     * @param {*} query Query
     * @param {*} sources External resources
     * @param {*} media Media type
     * @param {*} details Include extra information
     */
    async getId(query, sources, media, details) {
        const isTMDb = query.match(/^(t)(\d+)$/);

        // Is a TMDb id.
        if (isTMDb) {
            const index = isTMDb[2];

            if (details) {
                return this.movie.details(index);
            } else {
                return index;
            }
        }

        // Is an external id.
        for (let sourceName in sources) {
            const validation = sources[sourceName];
            const mediaObject = `${media}_results`;

            const isExternal = query.match(validation);

            if (isExternal) {
                const response = await this.find.byExternalId(query, { external_source: sourceName });
                if (response.error) return response;

                if (response[mediaObject].length > 0) {
                    return details ? response[mediaObject][0] : response[mediaObject][0].id;
                } else {
                    return this.error('External source not found or not in TMDb database.');
                }
            }
        }

        // Is not an id.
        const response = await this.search.movie(query);
        if (response.error) return response;

        if (response.results.length > 0) {
            return details ? response.results[0] : response.results[0].id;
        } else {
            return this.error('No results found.');
        }
    }

    /**
     * Splits pages into smaller pages to fit in an embed.
     *
     * Rushed variable names and comments. Struggling to follow it myself. WIll redo at some point.
     * 
     * @param {string} endpoint Endpoint to get results from
     * @param {Object} options API options
     * @returns {Object} Updated results
     */
    async getEndpointResults(endpoint, options) {
        // Check if query is required
        if (endpoint.includes('search') && !options.query) return this.error('Query required.');

        // Update page values
        const inputPage = options.page > 0 ? options.page : 1; // Input page
        options.page = Math.ceil(inputPage / 4); // Actual page

        // Check if page number is allowed
        if (options.page > 1000) return this.error('Page must be less then or equal to 4000.');

        // Get results from API
        const response = await this.getEndpoint(endpoint, options);
        if (response.error) return response; // API error

        // Change result data
        response.page = inputPage; // Update page number
        response.total_pages = Math.ceil(response.total_results / 5); // Update total pages

        // Check if there are results and input page is within total pages
        if (response.total_results === 0 || inputPage > response.total_pages)
            return this.error('No results found.');

        // Offset of the actual page
        const actualPageOffset = (inputPage - 1) % 4 * 5;

        // Get results from page offset
        response.results = response.results.slice(actualPageOffset, actualPageOffset + 5);
        // Change page index
        response.results = response.results.map((result, index) => {
            return { ...result, index: ((options.page - 1) * 20) + actualPageOffset + index + 1 };
        });

        // Return updated results
        return response;
    }
}

export default TMDb;
