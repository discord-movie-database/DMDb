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
        return `https://image.tmdb.org/t/p/w500${value}`;
    }

    releaseDate(value) {
        return new Date(value).getFullYear();
    }

    runtime(value) {
        return `${value} Minutes`;
    }

    adult(value) {
        return this.yesno(value);
    }

    genres(value) {
        return value.map(genre => genre.name).join(', ');
    }

    countries(value) {
        return value.map(country => country.name).join(', ');
    }

    languages(value) {
        return value.map(language => language.name).join(', ');
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
        return value;
    }

    voteCount(value) {
        return value;
    }

    IMDbID(value) {
        return value;
    }

    homepage(value) {
        return value;
    }

    birthday(value) {
        return new Date(value).getFullYear();
    }
    
    deathday(value) {
        return this.birthday(value);
    }

    gender(value) {
        return value === 2 ? 'Male' : 'Female';
    }
    
    personUrl(imdb, tmdb) {
        return imdb 
            ? `https://www.imdb.com/name/${imdb}`
            : `https://www.themoviedb.org/person/${tmdb}`;
    }

    knownFor(value) {
        return value.map(movie => movie.title).slice(0, 1).join(', ');
    }

    TMDbID(value) {
        return `t${value}`;
    }

    description(value) {
        return value.length > 2048 ? value.substr(0, 2045) + '...' : value;
    }

    check(value) {
        return value ? value.toString() : 'N/A';
    }

    parseEmbedFields(fields) {
        return fields.map(field => {
            return {
                'name': field.name,
                'value': this.check(field.value),
                'inline': typeof field.inline === 'boolean' ? field.inline : true
            }
        });
    }
}

module.exports = CommandHandler;