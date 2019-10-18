import axios from 'axios';
import consola from 'consola';

class UtilStructure {
    constructor(client) {
        this.client = client;
    }

    /**
     * Error message.
     * 
     * @param {string} message Message as string
     * @returns {Object} Message as object
     */
    error(message) {
        return { 'error': message };
    }

    /**
     * API request handler.
     * 
     * @param {string} base Base URL 
     * @param {string} endpoint Endpoint
     * @param {Object} data Request data
     * @returns {Object} Response
     */
    async get(base, endpoint, data) {
        if (!data) data = {};

        const paramNames = Object.keys(data);
        let parsedParams = '';

        for (let i = 0; i < paramNames.length; i++) {
            const param = paramNames[i];

            parsedParams += `${i === 0 ? '?' : '&'}${param}=${escape(data[param])}`;
        }

        try {
            return { response: body } = await axios.get(base + endpoint + parsedParams);
        } catch (error) {
            consola.error(error);

            return this.error('API Error. Try again later.');
        }
    }
}

export default UtilStructure;
