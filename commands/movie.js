const Command = require('../helpers/command');

class TitleCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get the primary information about a movie.',
            'usage': '<Movie Name or ID>',
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 700
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const movie = await this.api.dmdb.getMovie(query);
        if (movie.error) return this.embed.error(status, movie.error); // Error

        // Response
        this.embed.edit(status, {
            'url': this.tmdbMovieURL(movie.id),
            'title': movie.title,
            'description': this.description(movie.overview),
            'thumbnail': this.thumbnail(movie.poster_path),

            'fields': this.parseEmbedFields([
                { 'name': 'Status', 'value': movie.status },
                { 'name': 'Release Date', 'value': this.releaseDate(movie.release_date) },
                { 'name': 'Runtime', 'value': this.runtime(movie.runtime) },
                { 'name': 'Popularity', 'value': this.popularity(movie.popularity) },
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

            'footer': message.db.guild.tips ? 'TIP: Not the movie you wanted?' +
                ` Try searching for it using the ${message.db.guild.prefix}movies command.` : ''
        });
    }
}

module.exports = TitleCommand;
