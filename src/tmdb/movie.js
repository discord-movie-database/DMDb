/**
 * Movie endpoint.
 * 
 * @prop {Object} wrapper - API wrapper core
 * @prop {string} media - Media type
 * @prop {string} base - Endpoint base
 */
class MovieEndpoint {
    /**
     * Create movie endpoint.
     * 
     * @param {Object} wrapper - API wrapper core
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.media = 'movie';
        this.base = `/${this.media}`;
    }

    /**
     * Convert a query to a TMDb ID.
     * 
     * @param {string} query - Query
     * @param {boolean} details - Include extra information?
     * @returns {Promise<(string | Object)>} - TMDb ID or API response
     */
    getID(query, details, options) {
        return this.wrapper.getID(query, { imdb_id: /^(tt)(\d+)$/ }, this.media, details, options);
    }

    /**
     * Get the primary information for a movie.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-movie-details
     */
    async details(query, options) {
        const ID = await this.getID(query);
        if (ID.error) return ID;

        return this.wrapper.getEndpoint(`${this.base}/${ID}`, options);
    }

    /**
     * Get the images that belong to a movie.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-movie-images
     */
    async images(query, options, details) {
        const info = await this.getID(query, details, options);
        if (info.error) return info;

        const ID = details ? info.id : info;

        const response = await this.wrapper.getEndpoint(`${this.base}/${ID}/images`, options);
        if (response.error) return response;

        return details ? { ...response, ...info } : response;
    }

    /**
     * Get the cast and crew for a movie.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-movie-credits
     */
    async credits(query, options, details) {
        const info = await this.getID(query, details);
        if (info.error) return info;

        const ID = details ? info.id : info;

        const response = await this.wrapper.getEndpoint(`${this.base}/${ID}/credits`, options);
        if (response.error) return response;

        return details ? { ...response, ...info } : response;
    }

    /**
     * Get a list of similar movies.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-similar-movies
     */
    async similar(query, options, details, dontMutate) {
        let response;

        const info = await this.getID(query, details);
        if (info.error) return info;

        const ID = details ? info.id : info;

        const endpoint = `${this.base}/${ID}/similar`;

        if (dontMutate) {
            response = await this.wrapper.getEndpoint(endpoint, options);
        } else {
            response = await this.wrapper.mutateResults(endpoint, options);
        }

        return details ? { ...response, ...info } : response;
    }

    /**
     * Get the videos that have been added to a movie.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-movie-videos
     */
    async videos(query, options, details, dontMutate) {
        let response;

        const info = await this.getID(query, details);
        if (info.error) return info;

        const ID = details ? info.id : info;

        const endpoint = `${this.base}/${ID}/videos`;

        if (dontMutate) {
            response = await this.wrapper.getEndpoint(endpoint, options);
        } else {
            response = await this.wrapper.mutateResults(endpoint, options);
        }

        return details ? { ...response, ...info } : response;
    }

    /**
     * Get a list of the current popular movies on TMDb.
     * 
     * @param {Object} options - API options
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-popular-movies
     */
    async popular(options, dontMutate) {
        const endpoint = `${this.base}/popular`;

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options);
        }
    }

    /**
     * Get a list of the current popular movies on TMDb.
     * 
     * @param {Object} options - API options
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/movies/get-upcoming
     */
    async upcoming(options, dontMutate) {
        const endpoint = `${this.base}/upcoming`;

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options);
        }
    }
}

export default MovieEndpoint;
