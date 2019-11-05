/**
 * Command structure.
 * 
 * @prop {Object} client DMDb client extends Eris
 * @prop {Object} meta Command meta
 * @prop {Boolean} [meta.description] Command description
 * @prop {Boolean} [meta.usage] Command uage
 * @prop {Boolean} [meta.flags] Command flags
 * @prop {Boolean} [meta.developerOnly] Developer only?
 * @prop {Boolean} [meta.hideInHelp] Hide in help?
 * @prop {Number} [meta.weight] Command weight
 * @prop {String} TMDbURL Base URL for TMDb
 * @prop {String} IMDbURL Base URL for IMDb
 * @prop {String} YouTubeURL Base URL for YouTube
 * @prop {String} VimeoURL Base URL for Vimeo
 * @prop {Array} months Short name of months
 */
class CommandStructure {
    /**
     * Create command structure.
     * 
     * @param {Object} client DMDb client extends Eris
     * @param {Object} meta Command meta
     * @param {Boolean} [meta.description] Command description
     * @param {Boolean} [meta.usage] Command uage
     * @param {Boolean} [meta.flags] Command flags
     * @param {Boolean} [meta.developerOnly] Developer only?
     * @param {Boolean} [meta.hideInHelp] Hide in help?
     * @param {Number} [meta.weight] Command weight
     */
    constructor(client, meta) {
        this.client = client;

        this.embed = this.client.util.getUtil('embed');
        this.flags = this.client.util.getUtil('flags');
        this.tmdb = this.client.util.getUtil('tmdb');

        this.meta = {};
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
     * Creates incorrect usage error message.
     * 
     * @param {Object} message Message object
     * @returns {Promise} Message promise 
     */
    usageMessage(message) {
        return this.embed.error(message.channel.id, `Command usage: \`${this.meta.usage}\`.`);
    }

    /**
     * Creates status message.
     * 
     * @param {Object} message Message object
     * @param {Number} timeoutDuration Time before editing message with error
     * @returns {Promise} Message object
     */
    async searchingMessage(message, timeoutDuration) {
        const statusMessage = await this.embed.create(message.channel.id, { title: 'Searching...' });
        if (!statusMessage) return false;

        statusMessage.timeout = setTimeout(() => {
            this.embed.error(statusMessage, 'Bot took to long to respond. Try again later.');
        }, timeoutDuration || 10000);

        return statusMessage;
    }

    /**
     * Returns "s" if value is greater than one.
     * 
     * @param {Number} value Value
     * @returns {String} Plural
     */
    plural(value) {
        return value > 1 ? 's' : '';
    }

    /**
     * Splits array into chunks.
     * 
     * @param {Array} array Original array
     * @param {Number} size Chunk size
     * @returns {Array} Array of arrays
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
     * @param {Array} array List items
     * @returns {String} List seperated by commas
     */
    list(array) {
        return array.join(', ');
    }

    /**
     * Join array with a seperator.
     * 
     * @param {Array} array Array
     * @param {Boolean} thin Light seperator?
     * @returns {String} Connected string
     */
    join(array, thin) {
        return thin ? array.join(' | ') : array.join(' **|** ');
    }

    /**
     * Converts array into a response similar to the TMDb API.
     * 
     * @param {Array} results Results
     * @param {Number} page Page position
     * @param {Number} size Page size
     * @returns {Object} Results
     */
    resultStructure(results, page, size) {
        page = page ? page - 1 : 0;
        size = size || 5;

        const pages = this.splitArray(results, size);
        if (page > pages.length) return false;

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
     * @param {Object} result Result
     * @returns {String} Result string 
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
     * @param {String} name Field name 
     * @param {Array} values Field values
     * @param {Number} index Field index
     * @returns {Object} Field
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
     * @param {Array} fields Fields
     * @param {Boolean} notInline Disable default inline?
     * @returns {Array} Fields
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
     * @param {String} value Value
     * @returns {String} Original value or "N/A"
     */
    check(value) {
        return value || 'N/A';
    }

    /**
     * Returns size of array.
     * 
     * @param {Boolean} value Value
     * @returns {String} Updated value
     */
    size(values) {
        return values ? values.length : this.check(values);
    }

    /**
     * Converts boolean to yes or no.
     * 
     * @param {Boolean} value Value
     * @returns {String} Updated value
     */
    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    /**
     * Converts time into human readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
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
     * @param {String} value Value
     * @returns {String} Updated value 
     */
    year(value) {
        return value ? new Date(value).getFullYear() : this.check(value);
    }

    /**
     * Converts money value to readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    money(value) {
        return value ? `$${value.toLocaleString()}` : this.check(value);
    }

    /**
     * Converts popularity value to readable. 
     * 
     * @param {Number} value Value
     * @returns {Number} Updated value
     */
    popularity(value) {
        return Math.round(value);
    }

    /**
     * Converts gender value to readable.
     * 
     * @param {Number} value Value 
     * @returns {String} Updated value
     */
    gender(value) {
        return value ? value === 2 ? 'Male' : 'Female' : this.check(value);
    }

    /**
     * Converts runtime value to readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    runtime(value) {
        return value ? `${value} Minutes` : this.check(value);
    }

    /**
     * Converts money value to readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    money(value) {
        return value ? `$${value.toLocaleString()}` : 'N/A';
    }

    /**
     * Resizes description to fit in embed.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    description(value) {
        return value && value.length > 2048 ? value.substr(0, 2045) + '...' : this.check(value);
    }

    /**
     * Converts thumbnail ID to a URL.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    thumbnailURL(value, small) {
        const size = small ? 200 : 500;

        return value ?
            `https://image.tmdb.org/t/p/w${size}${value}` :
            `https://via.placeholder.com/${size}x${size * 1.5}?text=N/A`;
    }

    /**
     * Converts media type value to readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    mediaType(value) {
        return value === 'tv' ? 'TV' : value === 'movie' ? 'Movie' : this.check(value);
    }

    /**
     * Converts video key to URL.
     * 
     * @param {String} site Video source
     * @param {String} key Video key
     * @returns {String} Video URL
     */
    videoSourceURL(site, key) {
        if (site === 'YouTube') return `${this.YouTubeURL}/watch?v=${key}`;
        if (site === 'Vimeo') return `${this.VimeoURL}/${key}`;
    }

    /**
     * Converts video key to thumbnail URL.
     * 
     * @param {String} site Video source
     * @param {String} key Video key
     * @returns {String} Video thumbnail URL
     */
    videoThumbnailURL(site, key) {
        if (site === 'YouTube') return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
        if (site === 'Vimeo') return `https://i.vimeocdn.com/video/${key}_640.webp`;
    }

    /**
     * Converts TMDb ID value to readable.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    TMDbID(value) {
        return `t${value}`;
    }

    /**
     * Converts TMDb ID to a movie URL.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    TMDbMovieURL(value) {
        return `${this.TMDbID}/movie/${value}`;
    }

    /**
     * Converts TMDb ID to a person URL.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    TMDbPersonURL(value) {
        return `${this.TMDbID}/person/${value}`;
    }

    /**
     * Converts TMDb ID to a show URL.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    TMDbShowURL(value) {
        return `${this.TMDbID}/show/${value}`;
    }
}

export default CommandStructure;
