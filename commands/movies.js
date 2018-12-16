const Command = require('../handlers/commandHandler');

class MoviesCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for movies.',
            'longDescription': 'Multiple movies with the same name? Search for more than one movie.' +
                'Use the IMDb ID or TMDb ID with the movie command to get more detailed information about it.',
            'usage': '<Movie Name>',
            'weight': 60,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movies from API
        const movies = await this.api.getMovies(message.arguments.join(' '));
        if (movies.error) return this.embed.error(status, movies.error); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Current Page: **${movies.page}** **|**` +
                ` Total Pages: ${movies.total_pages} **|**` + 
                ` Total Results: ${movies.total_results}`,
            
            'fields': movies.results.map(movie => ({
                'name': movie.title,
                'value': `**${movie.index}** **|** ` +
                    `Vote Average: ${this.voteAverage(movie.vote_average)} **|** ` +
                    `Release: ${this.releaseDate(movie.release_date)} **|** ` +
                    `${this.TMDbID(movie.id)}`
            }))
        });
    }
}

module.exports = MoviesCommand;