const Command = require('../handlers/commandHandler');

class UpcomingCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Most popular movies in theatres at the moment.',
            'longDescription': 'TODO',
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Status of command response.
        const status = await this.client.handlers.embed.create(message.channel.id,
            { 'title': 'Getting movies...' });

        // Get movies from API.
        let movies = await this.client.handlers.api._get('movie/upcoming');

        // Check for error.
        if (movies.error) return this.client.handlers.embed.error(movies.error);
        // Check for results.
        if (!movies.results[0]) return this.client.handlers.embed.error('No results.');

        movies = movies.results; // Movies.

        // Response.
        this.client.handlers.embed.edit(status, {
            'title': 'Upcoming Movies',
            'description': this.info.shortDescription,
            
            'fields': movies.slice(0, 10).map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | \
Release: ${new Date(movie.release_date).toDateString()} | \
Vote Average: ${movie.vote_average} | \
Popularity: ${Math.round(movie.popularity)}`
            }})
        })
    }
}

module.exports = UpcomingCommand;