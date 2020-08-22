/**
 * Command structure.
 *
 * @prop {Object} client - DMDb client extends Eris
 * @prop {Object} meta - Command meta
 * @prop {boolean} [meta.description] - Command description
 * @prop {boolean} [meta.usage] - Command uage
 * @prop {boolean} [meta.flags] - Command flags
 * @prop {boolean} [meta.developerOnly] - Developer only?
 * @prop {boolean} [meta.hideInHelp] - Hide in help?
 * @prop {number} [meta.weight] - Command weight
 */
class CommandStructure {
    /**
     * Create command structure.
     *
     * @param {Object} client - DMDb client extends Eris
     * @param {Object} meta - Command meta
     * @param {boolean} [meta.description] - Command description
     * @param {boolean} [meta.usage] - Command uage
     * @param {boolean} [meta.flags] - Command flags
     * @param {boolean} [meta.developerOnly] - Developer only?
     * @param {boolean} [meta.hideInHelp] - Hide in help?
     * @param {number} [meta.weight] - Command weight
     */
    constructor(client, meta) {
        this.client = client;

        this.embed = this.client.util.getUtil('embed');
        this.flags = this.client.util.getUtil('flags');
        this.tmdb = this.client.util.getUtil('tmdb');
        this.fields = this.client.util.getUtil('fields');

        this.meta = {};
        this.meta.aliases = meta.aliases || [];
        this.meta.description = meta.description || false;
        this.meta.usage = meta.usage || false;
        this.meta.flags = meta.flags || false;
        this.meta.developerOnly = meta.developerOnly || false;
        this.meta.hideInHelp = meta.hideInHelp || false;
        this.meta.weight = meta.weight || 0;
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
     * Create success object.
     *
     * @param {string} message - Success message
     * @returns {Object} - Success object
     */
    success(message) {
        return { success: message };
    }

    /**
     * Creates incorrect usage error message.
     *
     * @param {Object} message - Message object
     * @returns {Promise} - Message promise
     */
    usageMessage(message) {
        return this.embed.error(message.channel.id, `Command usage: \`${this.meta.usage}\`.`);
    }

    /**
     * Creates status message.
     *
     * @param {Object} message - Message object
     * @param {number} timeoutDuration - Time before editing message with error
     * @returns {Promise} - Message object
     */
    async searchingMessage(message, timeoutDuration) {
        const statusMessage = await this.embed.create(message.channel.id, { title: 'Searching...' });
        if (!statusMessage) return false;

        statusMessage.timeout = setTimeout(() => {
            this.embed.error(statusMessage, 'Bot took too long to respond. Try again later.');

            this.client.log.error(`${message.command} by ${message.author.id} timed out.`);
        }, timeoutDuration || 10000);

        return statusMessage;
    }

    /**
     * Creats an object with default API options.
     *
     * @param {Object} options - Default options
     * @param {Object} custom - Custom options
     * @returns {Object} - Options object
     */
    APIOptions(options, custom) {
        return { ...custom, language: options.apiLanguage, region: options.apiRegion };
    }

    /**
     * Converts array into a response similar to the TMDb API.
     *
     * @param {Array} results - Results
     * @param {number} page - Page position
     * @param {number} size - Page size
     * @returns {Object} - Results
     */
    resultStructure(results, page, size) {
        if (results.length === 0) return this.error('No results.');

        page = page ? page - 1 : 0;
        size = size || 5;

        const pages = this.fields.splitArray(results, size);
        if (page > pages.length) return this.error('Invalid page.');

        return {
            page: page + 1,
            total_pages: pages.length,
            total_results: results.length,
            results: pages[page].map((item, index) => ({
                ...item, index: (((page + 1) * size) - size) + index + 1
            })),
        };
    }

    /**
     * Converts result structure into a string.
     *
     * @param {Object} result - Result
     * @returns {string} - Result string
     */
    resultsDescription(result) {
        const description = [
            `Current Page: ${result.page}`,
            `Total Pages: ${result.total_pages}`,
            `Total Results: ${result.total_results}`
        ];

        if (result.year) description.push(`Year: ${result.year}`);

        return this.fields.join(description);
    }

    /**
     * Resizes description to fit in embed.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    description(value) {
        return value && value.length > 2048 ? value.substr(0, 2045) + '...' : this.fields.check(value);
    }

    /**
     * Converts thumbnail ID to a URL.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    thumbnailURL(value, big) {
        const size = big ? 500 : 200;

        return value ?
            `https://image.tmdb.org/t/p/w${size}${value}` :
            `https://via.placeholder.com/${size}x${size * 1.5}?text=N/A`;
    }

    /**
     * Converts video key to thumbnail URL.
     *
     * @param {string} site - Video source
     * @param {string} key - Video key
     * @returns {string} - Video thumbnail URL
     */
    videoThumbnailURL(site, key) {
        if (site === 'YouTube') return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
        if (site === 'Vimeo') return `https://i.vimeocdn.com/video/${key}_640.webp`;
    }
}

export default CommandStructure;
