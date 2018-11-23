const Command = require('../handlers/commandHandler');

class MoviesCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for movies.',
            'longDescription': 'Advanced search to find specific movies.',
            'usage': 'Movie Name',
            'weight': 60,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0])
            return this.embed.error(message.channel.id, 'Query required.');

        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Searching...' });

        // Get movies from API
        let movies = await this.api.getMovies(message.arguments.join(' '), 1, true);
        if (movies.error) return this.embed.error(status, movies.error); // Error
        
        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Total Results: ${movies.total_results} | \
Page: ${movies.page}/${movies.total_pages}`,
            'fields': movies.results.slice(0, 10).map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | \
${movie.release_date ? `Release: ${this.releaseDate(movie.release_date)} |`: ''} \
Vote Average: ${this.voteAverage(movie.vote_average)} | \
Pop: ${this.popularity(movie.popularity)} | \
${this.TMDbID(movie.id)}`
            }})
        });
    }
}

module.exports = MoviesCommand;