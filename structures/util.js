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
        return { error: message };
    }

    /**
     * Converts JSON intro url parameters.
     * 
     * @param {Object} data Request data
     * @returns {String} Parsed parameters
     */
    parseParameters(data) {
        let parsed = '';

        const paramNames = Object.keys(data);
        for (let i = 0; i < paramNames.length; i++) {
            const paramName = paramNames[i];

            parsed += `${i === 0 ? '?' : '&'}${paramName}=${escape(data[paramName])}`;
        }

        return parsed;
    }

    /**
     * API GET request handler.
     * 
     * @param {string} base API URL
     * @param {string} endpoint Request endpoint
     * @param {Object} data Request data
     * @returns {Object} API Response
     */
    async _get(base, endpoint, data) {
        const parameters = this.parseParameters(data || {});

        try {
            const { data: response } = await this.client.axios({
                method: 'GET',
                url: base + endpoint + parameters
            });

            return response;
        } catch (error) {
            this.client.log.error(error);

            return this.error('API Error. Try again later.');
        }
    }
}

export default UtilStructure;
