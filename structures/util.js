/**
 * Util structure.
 * 
 * @prop {Object} client DMDb client extends Eris
 */
class UtilStructure {
    /**
     * Create util structure.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Error message.
     * 
     * @param {string} message Message as string
     * @returns {Object} Error message
     */
    error(message) {
        return { 'error': message };
    }

    /**
     * API GET request handler.
     * 
     * @param {string} base API URIL
     * @param {string} endpoint Request endpoint
     * @param {Object} data Request data
     * @returns {Object} API Response
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
            return { response: body } = await this.client.axios.get(base + endpoint + parsedParams);
        } catch (error) {
            this.client.log.error(error);

            return this.error('API Error. Try again later.');
        }
    }
}

export default UtilStructure;
