const Command = require('../handlers/commandHandler');

class UpcomingCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Most popular movies at the moment.',
            'longDescription': 'Top 10 most popular and upcoming movies in the theaters at the moment.',
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
        let movies = await this.api.getUpcomingMovies();
        if (movies.error) return this.embed.error(movies);

        movies = movies.results.slice(0, 10);

        // Response
        this.embed.edit(status, {
            'title': 'Upcoming Movies',
            'description': this.info.shortDescription,
            'fields': movies.map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | Pop: ${this.popularity(movie.popularity)} | \
Release: ${this.releaseDate(movie.release_date)} | \
Vote Average: ${this.voteAverage(movie.vote_average)} | \
${this.TMDbID(movie.id)}`
            }})
        })
    }
}

module.exports = UpcomingCommand;