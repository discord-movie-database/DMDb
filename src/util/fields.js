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
            birthday: () => ({
                icon: '🎉', // '🎂'
                name: 'Birthday',
                value: this.date(this.data.birthday),
                supports: ['person'],
            }),

            budget: () => ({
                icon: '💸',
                name: 'Budget',
                value: this.money(this.data.budget),
                supports: ['movie'],
            }),

            collection: () => (this.data.belongs_to_collection ? {
                icon: '🗃️',
                name: 'Collection',
                value: `[${this.data.belongs_to_collection.name}](${this.TMDbCollectionURL(this.data.belongs_to_collection.id)})`,
                supports: ['movie'],
            } : {}),

            createdBy: () => ({
                icon: '🌱',
                name: 'Created By',
                value: this.list(this.data.created_by.map((n) => n.name)),
                supports: ['show'],
            }),

            death: () => (this.data.deathday ? {
                icon: '🥀', // '🪦'
                name: 'Died',
                value: this.date(this.data.deathday),
                supports: ['person'],
            } : {}),

            episodeRuntime: () => ({
                icon: '🎞',
                name: 'Episode Runtime',
                value: this.runtime(this.data.episode_run_time),
                supports: ['show'],
            }),

            firstAired: () => ({
                icon: '📆',
                name: 'First Air Date',
                value: this.date(this.data.first_air_date),
                supports: ['show'],
            }),

            gender: () => ({
                icon: this.gender(this.data.gender, true),
                name: 'Gender',
                value: this.gender(this.data.gender),
                supports: ['person'],
            }),

            genre: () => ({
                icon: '👽', // '🏷️'
                name: `Genre${this.plural(this.data.genres)}`,
                value: this.list(this.data.genres.map((g) => g.name)),
                inline: false,
                supports: ['movie', 'show'],
            }),

            homepage: () => (this.data.homepage ? {
                icon: '🌐',
                name: 'Homepage',
                value: this.check(this.data.homepage),
                inline: false,
                supports: ['movie', 'person', 'show'],
            } : {}),

            imdb: () => ({
                // TODO: Inline SVG favicon?
                name: 'IMDb',
                value: this.IMDbURLMaker(this.data.imdb_id),
                supports: ['movie', 'person'],
            }),

            inProduction: () => ({
                icon: '🚦',
                name: 'In Production',
                value: this.yesno(this.data.in_production),
                supports: ['show'],
            }),

            knownFor: () => ({
                icon: '🎬',
                name: 'Known For',
                value: this.check(this.data.known_for_department),
                supports: ['person'],
            }),

            language: () => ({
                icon: '🗣',
                name: 'Language',
                value: this.list(this.data.spoken_languages.slice(0, 1).map((l) => l.name)),
                supports: ['movie'],
            }),

            languages: () => ({
                icon: '🗣',
                name: 'Language',
                value: this.list(this.data.spoken_languages.map((l) => l.name)),
                supports: ['movie'],
            }),

            lastAired: () => ({
                icon: '📅',
                name: 'Last Air Date',
                value: this.date(this.data.last_air_date),
                supports: ['show'],
            }),

            lastEpisode: () => ({
                icon: '📆',
                name: 'Last Episode Air Date',
                value: this.date(this.data.last_episode_to_air
                    ? this.data.last_episode_to_air.air_date : false),
                supports: ['show'],
            }),

            network: () => ({
                icon: '📡',
                name: `Network${this.plural(this.data.networks)}`,
                value: this.list(this.data.networks.map((n) => n.name)),
                inline: false,
                supports: ['show'],
            }),

            nextEpisode: () => (this.data.next_episode_to_air ? {
                icon: '🗓️',
                name: 'Next Episode Air Date',
                value: this.date(this.data.next_episode_to_air
                    ? this.data.next_episode_to_air.air_date : false),
                supports: ['show'],
            } : {}),

            originCountry: () => ({
                icon: '🗺️',
                name: `Origin Countr${this.plural(this.data.origin_country, true)}`,
                value: this.list(this.data.origin_country),
                inline: false,
                supports: ['show'],
            }),

            originCountryFlag: () => ({
                icon: '🗺️',
                name: `Origin Countr${this.plural(this.data.origin_country, true)}`,
                value: this.flags(this.data.origin_country),
                inline: false,
                supports: ['show'],
            }),

            placeOfBirth: () => ({
                icon: '📍',
                name: 'Place of Birth',
                value: this.check(this.data.place_of_birth),
                inline: false,
                supports: ['person'],
            }),

            productionCompany: () => ({
                icon: '🏢',
                name: `Production Compan${this.plural(this.data.production_companies, true)}`,
                value: this.list(this.data.production_companies.map((c) => c.name)),
                inline: false,
                supports: ['movie','show'],
            }),

            productionCountry: () => ({
                icon: '🗺️',
                name: `Production Countr${this.plural(this.data.production_countries, true)}`,
                value: this.list(this.data.production_countries.map((c) => c.name)),
                inline: false,
                supports: ['movie'],
            }),

            productionCountryFlag: () => ({
                icon: '🗺️',
                name: `Production Countr${this.plural(this.data.production_countries, true)}`,
                value: this.flags(this.data.production_countries.map((c) => c.iso_3166_1)),
                inline: false,
                supports: ['movie'],
            }),

            releaseDate: () => ({
                // TODO: allow to filter by country?
                // https://developers.themoviedb.org/3/movies/get-movie-release-date({
                icon: '📆',
                name: 'Release Date',
                value: this.date(this.data.release_date),
                supports: ['movie'],
            }),

            revenue: () => ({
                icon: '💰',
                name: 'Revenue',
                value: this.money(this.data.revenue),
                supports: ['movie'],
            }),

            runtime: () => ({
                icon: '🎞',
                name: 'Runtime',
                value: this.runtime(this.data.runtime),
                supports: ['movie'],
            }),

            score: () => ({
                icon: '⭐',
                name: 'User Score',
                value: `**${this.score(this.data.vote_average)}** `
                    + `(${this.number(this.data.vote_count)} votes)`,
                supports: ['movie', 'show'],
            }),

            seasons: () => ({
                icon: '🧮',
                name: 'Number of Seasons',
                value: `${this.check(this.data.number_of_seasons)} `
                    + `(${this.check(this.data.number_of_episodes)} episodes)`,
                supports: ['show'],
            }),

            status: () => ({
                icon: '🗞',
                name: 'Status',
                value: this.check(this.data.status),
                supports: ['movie', 'show'],
            }),

            tagline: () => ({
                icon: '💬',
                name: 'Tagline',
                value: this.check(this.data.tagline),
                inline: false,
                supports: ['movie', 'show'],
            }),

            type: () => ({
                icon: '📒', // '�'️
                name: 'Type',
                value: this.check(this.data.type),
                supports: ['show'],
            }),

            vote: () => ({
                icon: '⭐',
                name: 'Vote Average',
                value: `**${this.check(this.data.vote_average)}** `
                    + `(${this.number(this.data.vote_count)} votes)`,
                supports: ['movie', 'show'],
            }),

            // Composites

            // Fallbacks

            taglineOrGenre: () => (
                // Show genres instead of tagline if there isn't one.
                this.data.tagline ? this.fields.tagline() : this.fields.genre()
            ),
            voteOrStatus: () => (
                // Show status instead of votes if there are none.
                this.data.vote_average ? this.fields.vote() : this.fields.status()
            ),
            runtimeOrLanguage: () => (
                // Show language instead of runtime if not released yet.
                this.data.status === 'Released' ? this.fields.runtime() : this.fields.language()
            ),

            // Misc

            spacer: () => ({
                name: '—',
                value: '—',
                supports: ['movie', 'person', 'show'],
            }),
        };
    }

    /**
     * Set data.
     *
     * @param {Object} data - Keyed data for filling field templates
     */
    setData(data) {
        // this.client.log.info('setting data', data);
        this.data = data;
    }

    /**
     * Stub some fake data so we can grab this.fields from anywhere without errors.
     */
    stubDataForSupports() {
        this.setData({
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
        });
    }

    /**
     * Clear any set data.
     */
    clearData() {
        this.setData({});
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
     * @returns {object} - A {fields} field, or empty object
     */
    renderTemplate(type, data, more) {
        const defaults = {
            movie: ['taglineOrGenre', 'voteOrStatus', 'releaseDate', 'runtimeOrLanguage', 'collection'],
            person: ['knownFor', 'birthday', 'gender'],
            show: ['taglineOrGenre', 'voteOrStatus', 'firstAired', 'episodeRuntime'],
        };
        const mores = {
            movie: ['tagline', 'status', 'releaseDate', 'runtime', 'vote', 'imdb', 'genre', 'languages', 'productionCountry', 'productionCompany', 'homepage', 'budget', 'revenue', 'spacer'],
            person: ['gender', 'birthday', 'death', 'knownFor', 'imdb', 'placeOfBirth', 'homepage'],
            show: ['tagline', 'status', 'type', 'inProduction', 'firstAired', 'lastAired', 'episodeRuntime', 'lastEpisode', 'nextEpisode', 'seasons', 'vote', 'createdBy', 'productionCompany', 'network', 'homepage'],
        };

        let template = (more ? mores[type] : defaults[type]) || [];

        // TODO: get user-defined template from settings

        this.setData(data);

        const fields = [];
        template.forEach(f => fields.push(this.renderField(f)));

        this.clearData();

        // Filter out any empty objects renderField() might have included on errors
        return this.checkFields(fields.filter(o => Object.keys(o).length));
    }

    /**
     * Run a field template if it's defined.
     *
     * @param {string} template - Template
     * @returns {object} - A {fields} field, or empty object
     */
    renderField(field) {
        const r = this.fields[field];

        return r ? r() : {};
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
