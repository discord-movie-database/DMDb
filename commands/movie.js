const Command = require('../handlers/commandHandler');

class TitleCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get information about a movie.',
            'longDescription': 'Get information about a movie with an IMDb ID, TMDb ID, or the movie name.',
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 70
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const movie = await this.api.getMovie(query);
        if (movie.error) return this.embed.error(status, movie.error); // Error

        // Response
        this.embed.edit(status, {
            'url': this.movieUrl(movie.imdb_id, movie.id),
            'title': movie.title,
            'description': movie.overview,
            'thumbnail': this.thumbnail(movie.poster_path),

            'fields': this.parseEmbedFields([
                { 'name': 'Status', 'value': movie.status },
                { 'name': 'Release Date', 'value': this.releaseDate(movie.release_date) },
                { 'name': 'Runtime', 'value': this.runtime(movie.runtime) },
                { 'name': 'Adult', 'value': this.adult(movie.adult) },
                { 'name': 'Genres', 'value': this.genres(movie.genres), 'inline': false },
                { 'name': 'Countries', 'value': this.countries(movie.production_countries), 'inline': false },
                { 'name': 'Languages', 'value': this.languages(movie.spoken_languages), 'inline': false },
                { 'name': 'Budget', 'value': this.budget(movie.budget) },
                { 'name': 'Revenue', 'value': this.revenue(movie.revenue) },
                { 'name': 'Homepage', 'value': this.homepage(movie.homepage), 'inline': false },
                { 'name': 'Vote Average', 'value': this.voteAverage(movie.vote_average) },
                { 'name': 'Votes', 'value': this.voteCount(movie.vote_count) },
                { 'name': 'IMDb ID', 'value': this.IMDbID(movie.imdb_id) },
                { 'name': 'TMDb ID', 'value': this.TMDbID(movie.id)
            }]),

            'footer': `TIP: Not the movie you wanted? Try searching for it using the ${message.prefix}movies command.`
        });
    }
}

module.exports = TitleCommand;