/**
 * Find endpoint.
 * 
 * @prop {Object} wrapper - API wrapper core
 * @prop {string} base - Endpoint base
 */
class FindEndpoint {
    /**
     * Create find endpoint.
     * 
     * @param {Object} wrapper - API wrapper core
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/find';
    }

    /**
     * Converts external ID to TMDb ID.
     * 
     * @param {string} id - External ID
     * @param {Object} options - API options
     * @param {string} [options.external_source = imdb_id] - External source
     * @returns {Promise<Object>} - API response
     * 
     * @see https://developers.themoviedb.org/3/find/find-by-id
     */
    ID(ID, options) {
        options = Object.assign({ external_source: 'imdb_id' }, options);

        return this.wrapper.getEndpoint(`${this.base}/${ID}`, options);
    }
}

export default FindEndpoint;
