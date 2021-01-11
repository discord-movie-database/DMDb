/**
 * Command structure.
 *
 * @prop {Object} client Bot client
 * @prop {Object} meta Command meta
 * @prop {Object} flags Flags utility
 * @prop {Object} fields Fields utility
 * @prop {Object} data Data utility
 * @prop {Object} embed Embed utility
 *
 * @prop {Object} tmdb TMDb API wrapper
 */
export default class Command {
    /**
     * Creates an instance of Command.
     *
     * @param {Object} client Bot client
     * @param {Object} meta Command meta
     * @param {string} meta.name Command name
     * @param {Array<string>} [meta.aliases] Command aliases
     * @param {string} [meta.description] Command description
     * @param {string} [meta.arguments] Command arguments
     * @param {Array<string>} [meta.flags] Command flags
     * @param {boolean} [meta.developerOnly] Restrict command to developers only?
     * @param {boolean} [meta.hideInHelp] Hide command in help command?
     * @param {number} [meta.weight] Weight to position command in help command
     * @param {number} [meta.customFlags] One-off custom flags
     */
    constructor(client, meta) {
        this.client = client;

        this.meta = {
            name: null,
            aliases: [],
            description: 'No description.',
            arguments: null,
            flags: [],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 0,

            customFlags: {},

            ...meta,
        };

        this.flags = this.client.util.flags;
        this.fields = this.client.util.fields;
        this.data = this.client.util.data;
        this.embed = this.client.util.embed;
    }

    /**
     * Creates a message with correct argument information.
     *
     * @param {Object} message Message
     * @returns {Promise<Object>}
     */
    invalidArgsMessage(message) {
        return this.embed.error(message, `Command arguments: \`${this.meta.arguments}\`.`);
    }

    /**
     * Creates a status message.
     *
     * @param {Object} message Message
     * @param {Object} options Status message options
     * @param {string} [options.message] Message text
     * @param {number} [options.duration] Timeout time
     * @returns {Promise<Object>}
     */
    async statusMessage(message, options) {
        options = { message: 'Searching...', duration: 20000, ...options };

        try {
            const statusMessage = await this.embed.info(message, { title: options.message });

            statusMessage.timeout = setTimeout(() => {
                this.embed.error(statusMessage, 'Timed out. Try again later.');
            }, options.duration);

            return statusMessage;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Generates API options from a guild's settings.
     *
     * @param {Object} guildSettings Guild settings
     * @returns {Object}
     */
    defaultOptions(guildSettings) {
        return {
            region: guildSettings.api_region,
            language: guildSettings.api_language,
        };
    }

    /**
     * Gets media from method using flags.
     *
     * @param {Object} flags Flags
     * @param {Object} method Method
     * @param {Object} options Options
     * @returns {Promise<Object>}
     */
    getMediaFromMethod(flags, method, options) {
        if (flags.show) return this.client.tmdb.getTVShowFromMethod(method, options);
        if (flags.person) return this.client.tmdb.getPersonFromMethod(method, options);

        return this.client.tmdb.getMovieFromMethod(method, options);
    }

    /**
     * Gets the media endpoint using flags.
     *
     * @param {Object} flags Flags
     * @returns {Object}
     */
    getMediaEndpoint(flags) {
        if (flags.tv) return this.client.tmdb.tv;
        if (flags.person) return this.client.tmdb.person;

        return this.client.tmdb.movie;
    }

    /**
     * Splits array into chunks.
     *
     * @param {Array} array - Original array
     * @param {number} size - Chunk size
     * @returns {Array} - Array of arrays
     */
    splitArray(array, size) {
        const temp = array.slice();
        const chunks = [];

        while (temp.length > 0) {
            chunks.push(temp.splice(0, size));
        }

        return chunks;
    }
}
