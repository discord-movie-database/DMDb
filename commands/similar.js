const Command = require('../handlers/commandHandler');

class SimilarCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get information about a movie.',
            'longDescription': 'TODO',
            'usage': 'Movie Name or IMDb ID',
            'visible': true,
            'restricted': false,
            'weight': 999
        });
    }

    async process(message) {
        // Check for query.
        if (!message.arguments[0])
            return this.client.handlers.embed.error(message.channel.id,
                `${this.info.usage} required.`);

        // Status of command response.                          
        const status = await this.client.handlers.embed.create(message.channel.id, {
            'title': 'Searching...'
        });

        // Get movie from API.
        let movie = await this.client.handlers.api.search(message.arguments.join(' '));
        if (movie.error) return this.client.handlers.embed.error(status, movie.error); // Error.

        // Check for results.
        if (!movie.results[0])
            return this.client.handlers.embed.error(status, 'No movies found.');

        // Get movies from API.
        const id = movie.results[0].id; // Movie ID.
        let movies = await this.client.handlers.api._get(`movie/${id}/similar`);
        if (movies.error) return this.client.handlers.embed.error(status, movies.error); // Error.

        // Movies.
        movies = movies.results;

        // Response.
        this.client.handlers.embed.edit(status, {
            'title': 'Search Results',
            'description': `Showing 10 similar results.`,

            'fields': movies.map((movie, index) => { return { // .sort((a, b) => return b.popularity - a.popularity));
                'name': movie.title,
                'value': `**${(index + 1)}** | \
Release: ${new Date(movie.release_date).toDateString()} | \
Vote Average: ${movie.vote_average} | \
Popularity: ${Math.round(movie.popularity)}`
            }})
        });
    }
}

module.exports = SimilarCommand;