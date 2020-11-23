import Util from '../structures/Util';

/**
 * Data utility.
 *
 * @prop {string} TMDbURL Base URL for TMDb
 * @prop {string} IMDbURL Base URL for IMDb
 * @prop {string} YouTubeURL Base URL for YouTube
 * @prop {string} VimeoURL Base URL for Vimeo
 * @prop {Array<string>} months Short names for months
 */
export default class Data extends Util {
    /**
     * Creates an instance of Data.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.TMDbURL = 'https://www.themoviedb.org';
        this.IMDbURL = 'https://www.imdb.com';

        this.YouTubeURL = 'https://youtube.com';
        this.VimeoURL = 'https://vimeo.com';

        this.shortMonths = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        this.longMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
    }

    /**
     * Splits a list into chunks.
     *
     * @param {Array} list List
     * @param {number} size Chunk size
     * @returns {Array<Array>}
     */
    split(list, size) {
        const chunks = [];

        for (let i = 0; i < list.length; i += size) {
            chunks.push(list.slice(i, i + size));
        }

        return chunks;
    }

    /**
     * Returns the value or "N/A" if empty.
     *
     * @param {string} value Value
     * @returns {string}
     */
    check(value) {
        return value ? value.toString() : 'N/A';
    }

    /**
     * Formats description to be valid for embed.
     *
     * @param {string} value Description
     * @returns {string}
     */
    description(value) {
        return value && value.length > 2048 ? `${value.substr(0, 2045)}...` : this.check(value);
    }

    /**
     * Converts a boolean to yes or no.
     *
     * @param {boolean} value Boolean
     * @returns {string}
     */
    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    /**
     * Converts a number to a human readable format.
     *
     * @param {number} value Number
     * @returns {string}
     */
    number(value) {
        return value ? value.toLocaleString('en-US') : this.check(value);
    }

    /**
     * Converts money to a human readable format.
     *
     * @param {string} value Money
     * @returns {string}
     */
    money(value) {
        return value ? `$${value.toLocaleString('en-US')}` : this.check(value);
    }

    /**
     * Gets the ordinal indicator for a number.
     *
     * @param {number} value Number
     * @returns {string}
     */
    nth(value) {
        if (value > 3 && value < 21) return 'th';

        switch (value % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    /**
     * Converts a computer date to a human readable format.
     *
     * @param {string} value Date
     * @param {string} [short] Use short date?
     * @returns {string}
     */
    date(value, short) {
        if (!value) return this.check(value);

        const date = new Date(value);

        const day = date.getDate();
        const monthNum = date.getUTCMonth();
        const year = date.getUTCFullYear();

        const nth = this.nth(day);
        const month = short ? this.shortMonths[monthNum] : this.longMonths[monthNum];

        return [`${day}${nth}`, month, year].join(' ');
    }

    /**
     * Gets the year from a date.
     *
     * @param {string} value Date
     * @returns {string}
     */
    year(value) {
        return value ? new Date(value).getFullYear() : this.check(value);
    }

    /**
     * Converts a 1 - 10 rating to a percentage.
     *
     * @param {number} value Rating
     * @returns {string}
     */
    score(value) {
        return value ? `${value * 10}%` : this.check(value);
    }

    /**
     * Converts gender value to human readable.
     * @see https://www.themoviedb.org/talk/58ee5022c3a3683ded00a887
     *
     * @param {number} value Gender ID
     * @param {boolean} isSymbol Use gender symbols instead?
     * @returns {string}
     */
    gender(value, isSymbol) {
        const genders = {
            0: [this.check(value), '⚥'],
            1: ['Female', '♀️'],
            2: ['Male', '♂️'],
        };

        const type = isSymbol ? 1 : 0;

        return genders[value][type];
    }

    /**
     * Converts a duration to a human readable format.
     *
     * @param {number} value Duration in minutes
     * @return {string}
     */
    duration(value) {
        if (!value) return this.check(value);

        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        const duration = [];

        if (hours) duration.push(hours + this.plural(' Hour', hours));
        if (minutes) duration.push(minutes + this.plural(' Minute', minutes));

        return duration.join(' ');
    }

    /**
     * Converts a runtime to a human readable format.
     *
     * @param {(number|Array<number>)} value Runtime in minutes
     * @returns {string}
     */
    runtime(value) {
        if (Array.isArray(value)) {
            return value.map((time) => this.duration(time)).join(', ');
        }

        return value ? this.duration(value) : this.check(value);
    }

    /**
     * Converts ISO 3166-1 country codes to emoji flags through the magic of Unicode.
     * @see https://github.com/meeDamian/country-emoji/blob/master/src/lib.js
     *
     * @param {Array<Object>} value Production companies
     * @returns {string}
     */
    countryFlags(value) {
        if (!value) return this.check(value);

        const flags = value.map((country) => {
            const code = country.iso_3166_1;

            return String.fromCodePoint(...[...code].map((l) => 127397 + l.charCodeAt(0)));
        });

        return flags.join(' ');
    }

    /**
     * Converts a word to it's plural form.
     *
     * @param {number} value Word to convert to plural
     * @param {(Array|number)} data Data to determine if word is plural
     * @param {boolean} isOther Use the other english plural form?
     * @returns {string}
     */
    plural(value, data, isOther) {
        if (data <= 1 || data.length <= 1) return `${value}${isOther ? 'y' : ''}`;

        return `${value}${isOther ? 'ies' : 's'}`;
    }

    /**
     * Converts a string to title case.
     *
     * @param {string} value String
     * @returns {string}
     */
    titleCase(value) {
        const snowflakes = { tv: 'TV' };

        return snowflakes.hasOwnProperty(value)
            ? snowflakes[value]
            : value.charAt(0).toUpperCase() + value.slice(1);
    }

    /**
     * Converts multiple values into a list seperated by commas.
     *
     * @param {Array<string>} value Values
     * @param {Function} [fn] Function to run when mapping values
     * @returns {string}
     */
    list(value, fn) {
        return fn ? value.map((item) => fn(item)).join(', ') : value.join(', ');
    }

    /**
     * Joins multiple values using a seperator.
     *
     * @param {Array<string>} value Values
     * @returns {string}
     */
    join(value) {
        return value.join(' **|** ');
    }

    /**
     * Formats a TMDb ID to be recognisable by the bot.
     *
     * @param {string} value TMDb ID
     * @returns {string}
     */
    TMDbID(value) {
        return `t${value}`;
    }

    /**
     * Converts an image ID to a URL.
     *
     * @param {string} value Image ID
     * @param {boolean} isLarge Use larger dimensions?
     * @returns {string}
     */
    imageURL(value, isLarge) {
        const size = isLarge ? 500 : 200;

        return value
            ? `https://image.tmdb.org/t/p/w${size}${value}`
            : `https://via.placeholder.com/${size}x${size * 1.5}?text=N/A`;
    }

    /**
     * Creates a collection URL using it's TMDb ID.
     *
     * @param {string} value TMDb ID
     * @returns {string}
     */
    collectionURL(value) {
        return `${this.TMDbURL}/collection/${value}`;
    }

    /**
     * Creates a movie URL using it's TMDb ID.
     *
     * @param {string} value TMDb ID
     * @returns {string}
     */
    movieURL(value) {
        return `${this.TMDbURL}/movie/${value}`;
    }

    /**
     * Crates a movie search URL.
     *
     * @param {string} query Query
     */
    movieSearchURL(query) {
        return `${this.TMDbURL}/search/movie?query=${encodeURIComponent(query)}`;
    }

    /**
     * Creates a show URL using it's TMDb ID.
     *
     * @param {string} value TMDb ID
     * @returns {string}
     */
    showURL(value) {
        return `${this.TMDbURL}/tv/${value}`;
    }

    /**
     * Crates a show search URL.
     *
     * @param {string} query Query
     */
    showSearchURL(query) {
        return `${this.TMDbURL}/search/show?query=${encodeURIComponent(query)}`;
    }

    /**
     * Creates a person URL using their TMDb ID.
     *
     * @param {string} value TMDb ID
     * @returns {string}
     */
    personURL(value) {
        return `${this.TMDbURL}/person/${value}`;
    }

    /**
     * Crates a person search URL.
     *
     * @param {string} query Query
     */
    personSearchURL(query) {
        return `${this.TMDbURL}/search/person?query=${encodeURIComponent(query)}`;
    }

    /**
     * Converts an IMDb ID to a URL.
     *
     * @param {string} value IMDb ID
     * @returns {string}
     */
    createIMDbURL(value) {
        const prefix = value.slice(0, 2);

        const slugs = {
            tt: 'title/',
            nm: 'name/',
        };
        const slug = slugs.hasOwnProperty(prefix) ? slugs[prefix] : 'find?q=';

        return `[${value}](${this.IMDbURL}/${slug}${encodeURIComponent(value)})`;
    }

    /**
     * Converts video key to URL.
     *
     * @param {string} site Video source
     * @param {string} key Video key
     * @returns {string}
     */
    videoSourceURL(site, key) {
        if (site === 'YouTube') return `${this.YouTubeURL}/watch?v=${key}`;
        if (site === 'Vimeo') return `${this.VimeoURL}/${key}`;

        return this.TMDbURL;
    }
}
