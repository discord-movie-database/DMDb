class CommandHelper {
    constructor(client, info) {
        this.client = client;
        
        if (info) {
            this.info = {};

            this.info.name = info.name || false;
            this.info.description = info.description || '';
            this.info.documentation = info.documentation || false;
            this.info.usage = info.usage || '';
            this.info.visible = typeof info.visible === 'boolean'
                ? info.visible : false;
            this.info.restricted = typeof info.restricted === 'boolean'
                ? info.restricted : true; 
            this.info.weight = info.weight || 0;
        }

        this.util = this.client.handlers.util;
        this.embed = this.client.handlers.embed;
        this.api = this.client.handlers.api;

        this.config = this.client.config.options.bot;

        this.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    }

    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    joinResult(arr, light) {
        return light ? arr.join(' | ') : arr.join(' **|** ');
    }

    resultDescription(result) {
        const resultDescriptionData = [
            `Current Page: **${result.page}**`,
            `Total Pages: ${result.total_pages}`,
            `Total Results: ${result.total_results}`
        ];

        if (result.year) resultDescriptionData.push(`Year: ${result.year}`);

        return this.joinResult(resultDescriptionData);
    }

    imdbURL(ID) {
        return `https://www.imdb.com/title/${ID}`;
    }

    tmdbMovieURL(ID) {
        return `https://www.themoviedb.org/movie/${ID}`;
    }

    movieUrl(imdb, tmdb) {
        return imdb ? this.imdbURL(imdb) : this.tmdbMovieURL(tmdb);
    }

    tmdbShowURL(ID) {
        return `https://www.themoviedb.org/tv/${ID}`; 
    }

    thumbnail(value) {
        return value ? `https://image.tmdb.org/t/p/w500${value}` : 'https://via.placeholder.com/300x450?text=N/A';
    }

    releaseDate(value) {
        if (!value) return 'N/A';

        const date = new Date(value);

        let day = date.getDate();
        let month = date.getUTCMonth();
        let year = date.getFullYear();

        day = month && day ? `${day} ` : '';
        month = month ? `${this.months[month]} ` : '';
        year = year ? year : '';

        return day + month + year;
    }

    releaseDateYear(value) {
        return value ? new Date(value).getFullYear() : 'N/A';
    }

    runtime(value) {
        return value ? `${value} Minutes` : 'N/A';
    }

    epRuntime(value) {
        return this.runtime(value[0] || '');
    }

    type(value) {
        return value || 'N/A';
    }

    createdBy(value) {
        return value ?
            value.map(person => person.name).join(', ') : 'N/A';
    }

    seasonCount(value) {
        return value ? value.length : 'N/A';
    }

    episodeCount(value) {
        return value ?
            value.map(season => season.episode_count).reduce((a, b) => a + b) || 'N/A' : 'N/A';
    }

    networks(value) {
        return value ? value.map(network => network.name).join(', ') : 'N/A';
    }

    adult(value) {
        return this.yesno(value);
    }

    genres(value) {
        return value ? value.map(genre => genre.name).join(', ') : 'N/A';
    }

    countries(value) {
        return value ? value.map(country => country.name).join(', ') : 'N/A';
    }

    languages(value) {
        return value ? value.map(language => language.name).join(', ') : 'N/A';
    }

    budget(value) {
        return value ? `$${value.toLocaleString()}` : 'N/A';
    }

    revenue(value) {
        return this.budget(value);
    }

    popularity(value) {
        return Math.round(value);
    }

    voteAverage(value) {
        return value || 'N/A';
    }

    voteCount(value) {
        return value || 'N/A';
    }

    IMDbID(value) {
        return value || 'N/A';
    }

    homepage(value) {
        return value || 'N/A';
    }

    birthday(value) {
        return value ? new Date(value).getFullYear() : 'N/A';
    }
    
    deathday(value) {
        return this.birthday(value);
    }

    gender(value) {
        return value ? value === 2 ? 'Male' : 'Female' : 'N/A';
    }

    mediaType(value) {
        if (value === 'tv') return 'TV';
        if (value === 'movie') return 'Movie';
        
        return 'N/A';
    }

    placeOfBirth(value) {
        return value || 'N/A';
    }
    
    personUrl(imdb, tmdb) {
        return imdb 
            ? `https://www.imdb.com/name/${imdb}`
            : `https://www.themoviedb.org/person/${tmdb}`;
    }

    knownFor(value) {
        return value ? value.map(movie => movie.title).slice(0, 1).join(', ') : 'N/A';
    }

    knownForDep(value) {
        return value || 'N/A';
    }

    character(value) {
        return value || 'N/A';
    }

    name(value) {
        return value || 'N/A';
    }

    TMDbID(value) {
        return `t${value}`;
    }

    description(value) {
        value = value.split('\n')[0];
        return value.length > 2048 ? value.substr(0, 2045) + '...' : value;
    }

    review(value) {
        return value.length > 125 ? value.substr(0, 125) + '...' : value;
    }

    available(value) {
        return value ? value.toString() : 'N/A';
    }

    parseEmbedFields(fields) {
        return fields.map(field => ({
            'name': field.name,
            'value': this.available(field.value),
            'inline': typeof field.inline === 'boolean' ? field.inline : true
        }));
    }

    capitaliseStart(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    plural(amount) {
        return amount > 1 ? 's' : '';
    }

    uptime() {
        let uptimeString = '';
        const uptime = new Date(this.client.uptime);

        const years = uptime.getUTCFullYear() - 1970;
        const months = uptime.getUTCMonth();
        const days = uptime.getUTCDate() - 1;
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();

        if (years) uptimeString += `${years} Year${this.plural(years)}, `;
        if (months) uptimeString += `${months} Month${this.plural(months)}, `;
        if (days) uptimeString += `${days} Day${this.plural(days)}, `;
        if (hours) uptimeString += `${hours} Hour${this.plural(hours)}, `;
        if (minutes) uptimeString += `${minutes} Minute${this.plural(minutes)}, `;
        if (seconds) uptimeString += `${seconds} Second${this.plural(seconds)}`;

        return uptimeString;
    }

    async searchingMessage(message) {
        return await this.embed.create(message.channel.id, {
            'title': 'Searching...' });
    }

    async usageMessage(message) {
        return this.embed.error(message.channel.id,
            `Command usage: \`${this.info.usage}\``);
    }
}

module.exports = CommandHelper;
