const Command = require('../handlers/commandHandler');

class SimilarCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get similar movies.',
            'longDescription': 'Based on genres and keywords.',
            'usage': 'Movie Name or ID',
            'visible': true,
            'restricted': false,
            'weight': 30
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0])
            return this.embed.error(message.channel.id, `${this.info.usage} required.`);

        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Searching...' });

        // Get movie from API
        let movies = await this.api.getSimilarMovies(message.arguments.join(' '));
        if (movies.error) return this.embed.error(status, movies); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Showing 10 similar results.`,
            'fields': movies.map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | \
Release: ${this.releaseDate(movie.release_date)} | \
Vote Average: ${this.voteAverage(movie.vote_average)} | \
Popularity: ${this.popularity(movie.popularity)}`
            }})
        });
    }
}

module.exports = SimilarCommand;