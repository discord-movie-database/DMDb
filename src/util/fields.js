import UtilStructure from '../structures/util';

/**
 * Fields util.
 * @prop {string} TMDbURL - Base URL for TMDb
 * @prop {string} IMDbURL - Base URL for IMDb
 * @prop {string} YouTubeURL - Base URL for YouTube
 * @prop {string} VimeoURL - Base URL for Vimeo
 * @prop {Array} months - Short name of months
 * @prop {object} fields - Atomic callable field render functions
 */
class FieldsUtil extends UtilStructure {
    /**
     * Create meta field.
     *
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.TMDbURL = 'https://www.themoviedb.org';
        this.IMDbURL = 'https://www.imdb.com';

        this.YouTubeURL = 'https://youtube.com';
        this.VimeoURL = 'https://vimeo.com';

        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        this.fields = {
            // API Fields
            birthday: (data) => ({
                icon: '🎉', // '🎂'
                name: 'Birthday',
                value: this.date(data.birthday),
                supports: ['person'],
            }),

            budget: (data) => ({
                icon: '💸',
                name: 'Budget',
                value: this.money(data.budget),
                supports: ['movie'],
            }),

            collection: (data) => (data.belongs_to_collection ? {
                icon: '🗃️',
                name: 'Collection',
                value: `[${data.belongs_to_collection.name}](${this.TMDbCollectionURL(data.belongs_to_collection.id)})`,
                supports: ['movie'],
            } : {}),

            createdBy: (data) => ({
                icon: '🌱',
                name: 'Created By',
                value: this.list(data.created_by.map((n) => n.name)),
                supports: ['show'],
            }),

            death: (data) => (data.deathday ? {
                icon: '🥀', // '🪦'
                name: 'Died',
                value: this.date(data.deathday),
                supports: ['person'],
            } : {}),

            episodeRuntime: (data) => ({
                icon: '🎞',
                name: 'Episode Runtime',
                value: this.runtime(data.episode_run_time),
                supports: ['show'],
            }),

            firstAired: (data) => ({
                icon: '📆',
                name: 'First Aired',
                value: this.date(data.first_air_date),
                supports: ['show'],
            }),

            gender: (data) => ({
                icon: this.gender(data.gender, true),
                name: 'Gender',
                value: this.gender(data.gender),
                supports: ['person'],
            }),

            genre: (data) => ({
                icon: '👽', // '🏷️'
                name: `Genre${this.plural(data.genres)}`,
                value: this.list(data.genres.map((g) => g.name)),
                inline: false,
                supports: ['movie', 'show'],
            }),

            homepage: (data) => (data.homepage ? {
                icon: '🌐',
                name: 'Homepage',
                value: this.check(data.homepage),
                inline: false,
                supports: ['movie', 'person', 'show'],
            } : {}),

            imdb: (data) => ({
                // TODO: Inline SVG favicon?
                name: 'IMDb',
                value: this.IMDbURLMaker(data.imdb_id),
                supports: ['movie', 'person'],
            }),

            inProduction: (data) => ({
                icon: '🚦',
                name: 'In Production',
                value: this.yesno(data.in_production),
                supports: ['show'],
            }),

            knownFor: (data) => ({
                icon: '🎬',
                name: 'Known For',
                value: this.check(data.known_for_department),
                supports: ['person'],
            }),

            language: (data) => ({
                icon: '🗣',
                name: 'Language',
                value: this.list(data.spoken_languages.slice(0, 1).map((l) => l.name)),
                supports: ['movie'],
            }),

            languages: (data) => ({
                icon: '🗣',
                name: 'Language',
                value: this.list(data.spoken_languages.map((l) => l.name)),
                supports: ['movie'],
            }),

            lastAired: (data) => ({
                icon: '📅',
                name: 'Last Aired',
                value: this.date(data.last_air_date),
                supports: ['show'],
            }),

            lastEpisode: (data) => ({
                icon: '📆',
                name: 'Last Episode',
                value: this.date(data.last_episode_to_air
                    ? data.last_episode_to_air.air_date : false),
                supports: ['show'],
            }),

            network: (data) => ({
                icon: '📡',
                name: `Network${this.plural(data.networks)}`,
                value: this.list(data.networks.map((n) => n.name)),
                supports: ['show'],
            }),

            nextEpisode: (data) => (data.next_episode_to_air ? {
                icon: '🗓️',
                name: 'Next Episode',
                value: this.date(data.next_episode_to_air
                    ? data.next_episode_to_air.air_date : false),
                supports: ['show'],
            } : {}),

            originCountry: (data) => ({
                icon: '🗺️',
                name: `Origin Countr${this.plural(data.origin_country, true)}`,
                value: this.list(data.origin_country),
                inline: false,
                supports: ['show'],
            }),

            originCountryFlag: (data) => ({
                icon: '🗺️',
                name: `Origin Countr${this.plural(data.origin_country, true)}`,
                value: this.flags(data.origin_country),
                supports: ['show'],
            }),

            placeOfBirth: (data) => ({
                icon: '📍',
                name: 'Place of Birth',
                value: this.check(data.place_of_birth),
                inline: false,
                supports: ['person'],
            }),

            productionCompany: (data) => ({
                icon: '🏢',
                name: `Production Compan${this.plural(data.production_companies, true)}`,
                value: this.list(data.production_companies.map((c) => c.name)),
                inline: false,
                supports: ['movie','show'],
            }),

            productionCountry: (data) => ({
                icon: '🗺️',
                name: `Production Countr${this.plural(data.production_countries, true)}`,
                value: this.list(data.production_countries.map((c) => c.name)),
                inline: false,
                supports: ['movie'],
            }),

            productionCountryFlag: (data) => ({
                icon: '🗺️',
                name: `Production Countr${this.plural(data.production_countries, true)}`,
                value: this.flags(data.production_countries.map((c) => c.iso_3166_1)),
                supports: ['movie'],
            }),

            releaseDate: (data) => ({
                // TODO: allow to filter by country?
                // https://developers.themoviedb.org/3/movies/get-movie-release-date({
                icon: '📆',
                name: 'Release Date',
                value: this.date(data.release_date),
                supports: ['movie'],
            }),

            revenue: (data) => ({
                icon: '💰',
                name: 'Revenue',
                value: this.money(data.revenue),
                supports: ['movie'],
            }),

            runtime: (data) => ({
                icon: '🎞',
                name: 'Runtime',
                value: this.runtime(data.runtime),
                supports: ['movie'],
            }),

            score: (data) => ({
                icon: '⭐',
                name: 'User Score',
                value: `**${this.score(data.vote_average)}** `
                    + `(${this.number(data.vote_count)} votes)`,
                supports: ['movie', 'show'],
            }),

            seasons: (data) => ({
                icon: '🧮',
                name: 'Seasons',
                value: `${this.check(data.number_of_seasons)} `
                    + `(${this.check(data.number_of_episodes)} episodes)`,
                supports: ['show'],
            }),

            status: (data) => ({
                icon: '🗞',
                name: 'Status',
                value: this.check(data.status),
                supports: ['movie', 'show'],
            }),

            tagline: (data) => ({
                icon: '💬',
                name: 'Tagline',
                value: this.check(data.tagline),
                inline: false,
                supports: ['movie', 'show'],
            }),

            type: (data) => ({
                icon: '📒', // '�'️
                name: 'Type',
                value: this.check(data.type),
                supports: ['show'],
            }),

            vote: (data) => ({
                icon: '⭐',
                name: 'Vote Average',
                value: `**${this.check(data.vote_average)}** `
                    + `(${this.number(data.vote_count)} votes)`,
                supports: ['movie', 'show'],
            }),

            // Composites

            // Fallbacks

            taglineOrGenre: (data) => (
                // Show genres instead of tagline if there isn't one.
                data.tagline ? this.fields.tagline(data) : this.fields.genre(data)
            ),
            voteOrStatus: (data) => (
                // Show status instead of votes if there are none.
                data.vote_average ? this.fields.vote(data) : this.fields.status(data)
            ),
            runtimeOrLanguage: (data) => (
                // Show language instead of runtime if not released yet.
                data.status === 'Released' ? this.fields.runtime(data) : this.fields.language(data)
            ),

            // Misc

            spacer: (data) => ({
                name: '—',
                value: '—',
                supports: ['movie', 'person', 'show'],
            }),
        };
    }

    /**
     * Stub some fake data so we can grab this.fields from anywhere without errors.
     *
     * @returns {object} - keyed data similar to the API return
     */
    stubDataForSupports() {
        return {
            // optional inclusions
            belongs_to_collection: 1,
            deathday: 1,
            gender: 1,
            homepage: 1,
            imdb_id: 'tt123',
            next_episode_to_air: 1,

            // arrayable function calls
            created_by: [],
            genres: [],
            spoken_languages: [],
            networks: [],
            origin_country: [],
            production_companies: [],
            production_countries: [],
        };
    }

    /**
     * Checks field values and sets them as inline by default.
     *
     * @param {Array} fields - Fields
     * @param {boolean} notInline - Disable default inline?
     * @returns {Array} - Fields
     */
    checkFields(fields, notInline) {
        return fields.map(field => ({
            name: field.icon ? `${field.icon} — ${field.name}` : field.name,
            value: this.check(field.value),
            inline: notInline ? false : typeof field.inline === 'boolean' ? field.inline : true
        }));
    }

    /**
     * Run a field template if it's defined.
     *
     * @param {string} type - Type of template we want
     * @param {object} data - Keyed data as returned from the API
     * @param {object} flags - Any --more or --all flags that may have been passed
     * @param {object} config - guildSettings to check for saved templates
     * @returns {object} - A {fields} field, or empty object
     */
    renderTemplate(type, data, flags, config) {
        let template = [];

        if (flags.all) {
            const stubData = this.stubDataForSupports();
            Object.keys(this.fields).map((field) => {
                if (this.fields[field](stubData).supports.includes(type))
                    template.push(field);
            });
        } else {
            const defaults = {
                movie: ['taglineOrGenre', 'voteOrStatus', 'releaseDate', 'runtimeOrLanguage', 'collection'],
                person: ['knownFor', 'birthday', 'gender'],
                show: ['taglineOrGenre', 'voteOrStatus', 'firstAired', 'episodeRuntime'],
            };
            const mores = {
                movie: ['collection', 'tagline', 'status', 'releaseDate', 'runtime', 'vote', 'imdb', 'genre', 'languages', 'productionCountry', 'productionCompany', 'homepage', 'budget', 'revenue', 'spacer'],
                person: ['gender', 'birthday', 'death', 'knownFor', 'imdb', 'placeOfBirth', 'homepage'],
                show: ['tagline', 'status', 'type', 'inProduction', 'firstAired', 'lastAired', 'episodeRuntime', 'lastEpisode', 'nextEpisode', 'seasons', 'vote', 'createdBy', 'productionCompany', 'network', 'homepage'],
            };

            const settingsKey = `${type}Template`;
            template = (flags.more ? mores[type] : (config && config[settingsKey]) ? config[settingsKey].split(',') : defaults[type]) || [];
        }

        const fields = template.map((fieldName) => this.fields[fieldName](data));

        // Filter out any empty objects renderField() might have included on errors
        return this.checkFields(fields.filter(o => Object.keys(o).length));
    }

    /**
     * Format field.
     *
     * @param {string} name - Field name
     * @param {Array} values - Field values
     * @param {number} index - Field index
     * @returns {Object} - Field
     */
    renderResult(name, values, index) {
        return {
            name: name,
            value: index ? this.join([`**${index}**`, ...values]) : this.join(values),
        };
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
     * Converts vote number to percent.
     *
     * @param {number} value - Value
     * @returns {string} - - Updated value
     */
    score(value) {
        return value ? `${value * 10}%` : this.check(value);
    }

    /**
     * Converts gender value to readable.
     *
     * @see: https://www.themoviedb.org/talk/58ee5022c3a3683ded00a887?language=en-US
     *
     * @param {number} value - Value
     * @param {boolean} symbol - Return type
     * @returns {string} - Updated value
     */
    gender(value, symbol) {
        const genders = {
            0: [this.check(value), '⚥'],
            1: ['Female', '♀️'],
            2: ['Male', '♂️'],
            // ⚧️ ?
        };
        const index = symbol ? 1 : 0;

        return genders[value][index];
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
     * Converts ISO 3166 1 country codes to emoji flags through the magic of Unicode.
     * @see https://github.com/meeDamian/country-emoji/blob/master/src/lib.js
     *
     * @param {object} value - Value
     * @returns {string} - Updated value
     */
    flags(value) {
        return this.list(value.map((c) => String.fromCodePoint(...[...c].map(l => 127397 + l.charCodeAt(0)))));
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
     * Capitalise first letter in string.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    titleCase(value) {
        const snowflakes = {
            tv: 'TV',
        };
        return snowflakes.hasOwnProperty(value) ? snowflakes[value] : value.charAt(0).toUpperCase() + value.slice(1);
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
     * Converts TMDb ID value to readable.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbID(value) {
        return `t${value}`;
    }

    /**
     * Converts TMDb ID to a collection URL.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    TMDbCollectionURL(value) {
        return `${this.TMDbURL}/collection/${value}`;
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
     * Converts IMDb ID to a URL.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    IMDbURLMaker(value) {
        const prefix = value.slice(0,2);
        const slugs = {
            tt: 'title/',
            nm: 'name/',
        };
        const slug = slugs.hasOwnProperty(prefix) ? slugs[prefix] : 'find?q=';
        return `${this.IMDbURL}/${slug}${encodeURIComponent(value)}`;
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
}

export default FieldsUtil;
