const Command = require('../handlers/commandHandler');

class SearchCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for multiple movies.',
            'longDescription': 'TODO',
            'usage': 'Movie Name',
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query.
        if (!message.arguments[0])
            return this.client.handlers.embed.error(message.channel.id, 'Query required.');

        // Status of command response.
        const status = await this.client.handlers.embed.create(message.channel.id,
            { 'title': 'Searching...' });

        // Get movies from API.
        const response = await this.client.handlers.api.search(message.arguments.join(' '));
        if (response.error) return this.client.handlers.embed.error(response.error); // Error.

        // Check for results.
        if (!response.results[0]) 
            return this.client.handlers.embed.error('No movies found.');
        const movies = response.results; // Results.
        
        // Response.
        this.client.handlers.embed.edit(status, {
            'title': 'Search Results',
            'description': `Total Results: ${response.total_results} | \
Page: ${response.page}/${response.total_pages}`,

            'fields': movies.slice(0, 10).map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | \
Release: ${new Date(movie.release_date).toDateString()} | \
Vote Average: ${movie.vote_average} | \
Popularity: ${Math.round(movie.popularity)}`
            }})
        });
    }
}

module.exports = SearchCommand;