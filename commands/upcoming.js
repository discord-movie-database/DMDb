const Command = require('../handlers/commandHandler');

class UpcomingCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Most popular movies in theaters at the moment.',
            'longDescription': 'Top 5 most popular and upcoming movies in the theaters at the moment.',
            'visible': true,
            'restricted': false,
            'weight': 10
        });
    }

    async process(message) {
        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movies from API
        const movies = await this.api.dmdb.getUpcomingMovies();
        if (movies.error) return this.embed.error(movies);

        // Response
        this.embed.edit(status, {
            'title': 'Upcoming Movies',
            'description': this.info.shortDescription,

            'fields': movies.results.map((movie, index) => ({
                'name': movie.title,
                'value': `**${(index + 1)}** **|** ` +
                    `Release: ${this.releaseDate(movie.release_date)} **|** ` +
                    `Vote Average: ${this.voteAverage(movie.vote_average)} **|** ` +
                    `${this.TMDbID(movie.id)}`
            }))
        });
    }
}

module.exports = UpcomingCommand;