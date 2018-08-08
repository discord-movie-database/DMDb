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
    }

    check(value) {
        return value ? value : 'N/A';
    }

    url(imdb, tmdb) {
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
        return value ? 'Yes' : 'No'
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
        return value ? `$${value.toLocaleString()}` : 'N/A';
    }

    voteAverage(value) {
        return value ? value.toString() : 'N/A';
    }

    voteCount(value) {
        return value ? value.toString() : 'N/A';
    }
}

module.exports = CommandHandler;