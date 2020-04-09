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
 * @prop {string} TMDbURL - Base URL for TMDb
 * @prop {string} IMDbURL - Base URL for IMDb
 * @prop {string} YouTubeURL - Base URL for YouTube
 * @prop {string} VimeoURL - Base URL for Vimeo
 * @prop {Array} months - Short name of months
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

        this.meta = {};
        this.meta.aliases = meta.aliases || [];
        this.meta.description = meta.description || false;
        this.meta.usage = meta.usage || false;
        this.meta.flags = meta.flags || false;
        this.meta.developerOnly = meta.developerOnly || false;
        this.meta.hideInHelp = meta.hideInHelp || false;
        this.meta.weight = meta.weight || 0;

        this.TMDbURL = 'https://www.themoviedb.org';
        this.IMDbURL = 'https://www.imdb.com';
        
        this.YouTubeURL = 'https://youtube.com';
        this.VimeoURL = 'https://vimeo.com';

        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
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
     * Returns "s" if value is greater than one.
     * 
     * @param {number} value - Value
     * @returns {string} - Plural
     */
    plural(value, type) {
        value = Array.isArray(value) ? value.length : value;

        return value > 1 ? type ? 'ies' : 's' : type ? 'y' : '';
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

    /**
     * Converts array into string.
     * 
     * @param {Array} array - List items
     * @returns {string} - List seperated by commas
     */
    list(array) {
        return array.length > 0 ? array.join(', ') : this.check(false);
    }

    /**
     * Join array with a seperator.
     * 
     * @param {Array} array - Array
     * @param {boolean} thin - Light seperator?
     * @returns {string} - Connected string
     */
    join(array, thin) {
        return thin ? array.join(' | ') : array.join(' **|** ');
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

        const pages = this.splitArray(results, size);
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

        return this.join(description);
    }

    /**
     * Format field.
     * 
     * @param {string} name - Field name 
     * @param {Array} values - Field values
     * @param {number} index - Field index
     * @returns {Object} - Field
     */
    resultField(name, values, index) {
        return {
            name: name,
            value: index ? this.join([`**${index}**`, ...values]) : this.join(values),
        };
    }

    /**
     * Checks field values and sets them as inline by default.
     * 
     * @param {Array} fields - Fields
     * @param {boolean} notInline - Disable default inline?
     * @returns {Array} - Fields
     */
    fields(fields, notInline) {
        return fields.map(field => ({
            name: field.name,
            value: this.check(field.value),
            inline: notInline ? false : typeof field.inline === 'boolean' ? field.inline : true
        }));
    }

    /**
     * Returns "N/A" if there is no value.
     * 
     * @param {string} value - Value
     * @returns {string} - Original value or "N/A"
     */
    check(value) {
        return value ? value.toString() : 'N/A';
    }

    /**
     * Returns size of array.
     * 
     * @param {boolean} value - Value
     * @returns {string} - Updated value
     */
    size(values) {
        return values ? values.length : this.check(values);
    }

    /**
     * Converts boolean to yes or no.
     * 
     * @param {boolean} value - Value
     * @returns {string} - Updated value
     */
    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    /**
     * Converts time into human readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    date(value) {
        if (!value) return this.check(value);

        const date = new Date(value);

        let day = date.getDate();
        let month = date.getUTCMonth();
        let year = date.getFullYear();

        day = month && day ? `${day} ` : '';
        month = month ? `${this.months[month]} ` : '';
        year = year ? year : '';

        return day + month + year;
    }

    /**
     * Get year from date.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value 
     */
    year(value) {
        return value ? new Date(value).getFullYear() : this.check(value);
    }

    /**
     * Converts money value to readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    money(value) {
        return value ? `$${value.toLocaleString()}` : this.check(value);
    }

    /**
     * Converts number to readable.
     * 
     * @param {number} value - Value
     * @returns {string} - - Updated value
     */
    number(value) {
        return value ? value.toLocaleString('en-US') : this.check(value);
    }

    /**
     * Converts gender value to readable.
     * 
     * @param {number} value - Value 
     * @returns {string} - Updated value
     */
    gender(value) {
        return value ? value === 2 ? 'Male' : 'Female' : this.check(value);
    }

    /**
     * Format duration.
     * 
     * @param {string} value - Value
     * @return {string} - Updated value
     */
    duration(value) {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        const _hours = hours ? `${hours} Hour${hours > 1 ? 's' : ''} ` : '';
        const _minutes = minutes ? `${minutes} Minute${minutes > 1 ? 's' : ''}` : '';

        return _hours + _minutes;
    }

    /**
     * Converts runtime value to readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    runtime(value) {
        return value ? Array.isArray(value) ? value.map((r) => this.duration(r)).join(', ')
            : this.duration(value) : this.check(value);
    }

    /**
     * Converts money value to readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    money(value) {
        return value ? `$${value.toLocaleString()}` : 'N/A';
    }

    /**
     * Resizes description to fit in embed.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    description(value) {
        return value && value.length > 2048 ? value.substr(0, 2045) + '...' : this.check(value);
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
     * Converts media type value to readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    mediaType(value) {
        return value === 'tv' ? 'TV' : value === 'movie' ? 'Movie' : this.check(value);
    }

    /**
     * Get media source from flags.
     * 
     * @param {Object} flags - Flags
     * @returns {string} - Media source
     */
    mediaSource(flags) {
        return flags.tv ? 'tv' : flags.person ? 'person' : 'movie';
    }

    /**
     * Converts video key to URL.
     * 
     * @param {string} site - Video source
     * @param {string} key - Video key
     * @returns {string} - Video URL
     */
    videoSourceURL(site, key) {
        if (site === 'YouTube') return `${this.YouTubeURL}/watch?v=${key}`;
        if (site === 'Vimeo') return `${this.VimeoURL}/${key}`;
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

    /**
     * Converts TMDb ID value to readable.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbID(value) {
        return `t${value}`;
    }

    /**
     * Converts TMDb ID to a movie URL.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbMovieURL(value) {
        return `${this.TMDbURL}/movie/${value}`;
    }

    /**
     * Converts TMDb ID to a person URL.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbPersonURL(value) {
        return `${this.TMDbURL}/person/${value}`;
    }

    /**
     * Converts TMDb ID to a show URL.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbShowURL(value) {
        return `${this.TMDbURL}/tv/${value}`;
    }

    /**
     * Capitalise first letter in string.
     * 
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    titleCase(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}

export default CommandStructure;
