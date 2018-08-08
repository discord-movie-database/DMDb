const Command = require('../handlers/commandHandler');

class TitleCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get information about a movie.',
            'longDescription': 'TODO',
            'usage': 'Movie Name or T/IMDb ID',
            'visible': true,
            'restricted': false,
            'weight': 999
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.embed.error(message.channel.id,
            `${this.info.usage} required.`);

        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Searching...' });

        // Get movie from API
        const movie = await this.api.getMovie(message.arguments.join(' '));
        if (movie.error) return this.embed.error(status, movie); // Error

        // Response
        this.embed.edit(status, {
            'url': this.url(movie.imdb_id, movie.id),
            'title': movie.title,
            'description': movie.overview,
            'thumbnail': this.thumbnail(movie.poster_path),
            'fields': [{ 'name': 'Status', 'value': movie.status },
                { 'name': 'Release Year', 'value': this.releaseDate(movie.release_date) },
                { 'name': 'Runtime', 'value': this.runtime(movie.runtime) },
                { 'name': 'Adult', 'value': this.adult(movie.adult) },
                { 'name': 'Genres', 'value': this.genres(movie.genres), 'inline': false },
                { 'name': 'Countries', 'value': this.countries(movie.production_countries), 'inline': false },
                { 'name': 'Languages', 'value': this.languages(movie.spoken_languages), 'inline': false },
                { 'name': 'Budget', 'value': this.budget(movie.budget) },
                { 'name': 'Revenue', 'value': this.revenue(movie.revenue) },
                { 'name': 'Homepage', 'value': this.check(movie.homepage), 'inline': false },
                { 'name': 'Vote Average', 'value': this.voteAverage(movie.vote_average) },
                { 'name': 'Vote Count', 'value': this.voteCount(movie.vote_count) },
                { 'name': 'IMDb ID', 'value': this.check(movie.imdb_id) },
                { 'name': 'TMDb ID', 'value': movie.id
            }].map(field => ({ ...field, 'inline': typeof field.inline === 'boolean'
                                                   ? field.inline : true }))
        });
    }
}

module.exports = TitleCommand;