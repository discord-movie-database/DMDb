const Command = require('../handlers/commandHandler');

class UpcomingCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Most popular movies in theatres at the moment.',
            'longDescription': 'A list of upcoming movies in theatres.',
            'visible': true,
            'restricted': false,
            'weight': 10
        });
    }

    async process(message) {
        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Getting movies...' });

        // Get movies from API
        const movies = await this.api.getUpcomingMovies();
        if (movies.error) return this.embed.error(movies); 

        // Response
        this.embed.edit(status, {
            'title': 'Upcoming Movies',
            'description': this.info.shortDescription,
            'fields': movies.map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | \
Release: ${this.releaseDate(movie.release_date)} | \
Vote Average: ${this.voteAverage(movie.vote_average)} | \
Popularity: ${this.popularity(movie.popularity)}`
            }})
        })
    }
}

module.exports = UpcomingCommand;