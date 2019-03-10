const Command = require('../handlers/commandHandler');

class SimilarCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get similar movies.',
            'documentation': true,
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 30
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const movies = await this.api.dmdb.getSimilarMovies(query);
        if (movies.error) return this.embed.error(status, movies); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Showing similar results based on keywords and genres.`,

            'fields': movies.results.map((movie, index) => ({
                'name': movie.title,
                'value': this.joinResult([
                    `**${(index + 1)}**`,
                    `Release: ${this.releaseDate(movie.release_date)}`,
                    `Vote Average: ${this.voteAverage(movie.vote_average)}`,
                    `${this.TMDbID(movie.id)}`
                ])
            }))
        });
    }
}

module.exports = SimilarCommand;