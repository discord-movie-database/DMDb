const request = require('superagent');

class APITemplate {
    constructor(client) {
        this.client = client;

        this.request = request;
        this.util = this.client.handlers.util;
    }

    /**
     * Convert error message string into a object
     * 
     * @param {string} message error message
     * @returns {object} error object
     */
    error(message) {
        return { 'error': message };
    }

    /**
     * Get data from API with endpoint and parameters
     * 
     * @param {string} base Base API URL 
     * @param {string} endpoint Location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} API response
     */
    async _get(base, endpoint, params) {
        params = params || {};

        let paramNames = Object.keys(params);
        let parsedParams = '';
        for (let i = 0; i < paramNames.length; i++) {
            parsedParams += `${i === 0 ? '?' : '&'}${paramNames[i]}=${params[paramNames[i]]}`;
        }

        const requestURL = base + endpoint + parsedParams;

        let response;
        try {
            response = await this.request.get(requestURL);
        } catch (err) { console.log(err); }

        if (response && response.statusCode === 429)
            return this.error('Ratelimited. Try again later.');
        if (!response || response.statusCode !== 200) return this.error('API Error.');

        return response.body;
    }
}

module.exports = APITemplate;