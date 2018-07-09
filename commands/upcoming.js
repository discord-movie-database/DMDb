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
        const status = await this.client.handlers.embed.create(message.channel.id, {
            'title': 'Getting movies...'
        });

        let movies = await this.client.handlers.api._get('movie/upcoming' ,'page=1&language=en-US');

        if (movies.error) return this.client.handlers.embed.error(movies.error);
        if (!movies.results) return this.client.handlers.embed.error('No results.');

        movies = movies.results;
        this.client.handlers.embed.edit(status, {
            'title': 'Upcoming Movies',
            'description': this.info.shortDescription,
            'fields': movies.slice(0, 10).map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | Release: ${new Date(movie.release_date).toDateString()} | Vote Average: ${movie.vote_average} | Popularity: ${Math.round(movie.popularity)}`
            }})
        })
    }
}

module.exports = UpcomingCommand;