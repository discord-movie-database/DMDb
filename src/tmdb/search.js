/**
 * Search endpoint.
 * 
 * @prop {Object} wrapper - API wrapper core
 * @prop {string} base - Endpoint base
 */
class SearchEndpoint {
    /**
     * Create search endpoint.
     * 
     * @param {Object} wrapper - API wrapper core
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/search';
    }

    /**
     * Search for movies.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {string} [options.primary_release_year] - Primary release year
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/search/search-movies
     */
    movie(query, options, dontMutate) {
        const endpoint = `${this.base}/movie`;

        options = Object.assign({ query }, options);
        options.primary_release_year = options.year;

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options, true);
        }
    }

    /**
     * Search for TV shows.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {string} [options.first_air_date_year] - First air date year
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/search/search-tv-shows
     */
    tv(query, options, dontMutate) {
        const endpoint = `${this.base}/tv`;

        options = Object.assign({ query }, options);
        options.first_air_date_year = options.year;

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options, true);
        }
    }

    /**
     * Search for people.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/search/search-people
     */
    person(query, options, dontMutate) {
        const endpoint = `${this.base}/person`;

        options = Object.assign({ query }, options);

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options, true);
        }
    }
}

export default SearchEndpoint;
