const Command = require('../handlers/commandHandler');

class SimilarCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get similar movies.',
            'longDescription': 'Search for movies similar to query.',
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 30
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage();

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const movies = await this.api.getSimilarMovies(message.arguments.join(' '));
        if (movies.error) return this.embed.error(status, movies); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': 'Showing 10 similar results.',

            'fields': movies.map((movie, index) => ({
                'name': movie.title,
                'value': `**${(index + 1)}** **|** ` +
                    `Release: ${this.releaseDate(movie.release_date)} **|** ` +
                    `Vote Average: ${this.voteAverage(movie.vote_average)} **|** ` +
                    `${this.TMDbID(movie.id)}`
            }))
        });
    }
}

module.exports = SimilarCommand;