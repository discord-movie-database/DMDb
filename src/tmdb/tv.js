/**
 * TV endpoint.
 * 
 * @prop {Object} wrapper - API wrapper core
 * @prop {string} media - Media type
 * @prop {string} base - Endpoint base
 */
class TVEndpoint {
    /**
     * Create TV endpoint.
     * 
     * @param {Object} wrapper - API wrapper core
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.media = 'tv';
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
        const validation = { imdb_id: /^(tt)(\d+)$/, tvdb_id: /^(tv)(\d+)$/ };

        return this.wrapper.getID(query, validation, this.media, details, options);
    }

    /**
     * Get the primary information for a TV show.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-tv-details
     */
    async details(query, options) {
        const ID = await this.getID(query);
        if (ID.error) return ID;

        return this.wrapper.getEndpoint(`${this.base}/${ID}`, options);
    }

    /**
     * Get the images that belong to a TV show.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-tv-details
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
     * Get the cast and crew for a TV show.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-tv-credits
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
     * Get a list of similar TV shows.
     * 
     * @param {string} query - Query
     * @param {Object} options - API options
     * @param {boolean} details - Include extra information?
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-similar-tv-shows
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
     * @see https://developers.themoviedb.org/3/tv/get-tv-videos
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
     * Get a list of the current popular TV shows on TMDb.
     * 
     * @param {Object} options - API options
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-popular-tv-shows
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
     * Get a list of TV shows that are airing today.
     * 
     * @param {Object} options - API options
     * @param {boolean} dontMutate - Do not mutate the results?
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/tv/get-tv-airing-today
     */
    async airing(options, dontMutate) {
        const endpoint = `${this.base}/airing_today`;

        if (dontMutate) {
            return this.wrapper.getEndpoint(endpoint, options);
        } else {
            return this.wrapper.mutateResults(endpoint, options);
        }
    }
}

export default TVEndpoint;
