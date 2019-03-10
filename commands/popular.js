const Command = require('../handlers/commandHandler');

class PopularCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Most popular movies on TMDb.',
            'documentation': false,
            'visible': true,
            'restricted': false,
            'weight': 10
        });
    }

    async process(message) {
        const query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        const flags = this.util.flags(query);

        // Get movies from API
        const movies = await this.api.dmdb.getPopularMovies(flags);
        if (movies.error) return this.embed.error(movies);

        // Response
        this.embed.edit(status, {
            'title': 'Popular Movies',
            'description': `Current Page: **${movies.page}** **|** `+
                `Total Pages: ${movies.total_pages} **|** ` +
                `Total Results: ${movies.total_results}`,

            'fields': movies.results.map((movie) => ({
                'name': movie.title,
                'value': `**${movie.index}** **|** ` +
                    `Release: ${this.releaseDate(movie.release_date)} **|** ` +
                    `Vote Average: ${this.voteAverage(movie.vote_average)} **|** ` +
                    `${this.TMDbID(movie.id)}`
            }))
        });
    }
}

module.exports = PopularCommand;
