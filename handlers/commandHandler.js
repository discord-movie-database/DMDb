class CommandHandler {
    constructor(client, info) {
        this.client = client;
        
        this.info = {};

        this.info.name = info.name || false;
        this.info.shortDescription = info.shortDescription || '';
        this.info.longDescription = info.longDescription || '';
        this.info.usage = info.usage || '';
        this.info.visible = typeof info.visible === 'boolean'
            ? info.visible : false;
        this.info.restricted = typeof info.restricted === 'boolean'
            ? info.restricted : true; 
        this.info.weight = info.weight || 0;

        this.embed = this.client.handlers.embed;
        this.api = this.client.handlers.api;

        this.config = this.client.config.options.bot;

        this.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    }

    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    movieUrl(imdb, tmdb) {
        return imdb 
            ? `https://www.imdb.com/title/${imdb}`
            : `https://www.themoviedb.org/movie/${tmdb}`;
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

    placeOfBirth(value) {
        return value || 'N/A';
    }
    
    personUrl(imdb, tmdb) {
        return imdb 
            ? `https://www.imdb.com/name/${imdb}`
            : `https://www.themoviedb.org/person/${tmdb}`;
    }

    knownFor(value) {
        return value.map(movie => movie.title).slice(0, 1).join(', ');
    }

    knownForDep(value) {
        return value || 'N/A';
    }

    TMDbID(value) {
        return `t${value}`;
    }

    description(value) {
        return value.length > 2048 ? value.substr(0, 2045) + '...' : value;
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
}

module.exports = CommandHandler;