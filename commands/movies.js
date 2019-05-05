const Command = require('../helpers/command');

class MoviesCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Search for movies.',
            'usage': '<Movie Name>',
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 650
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        // Get movies from API
        const movies = await this.api.dmdb.getMovies(flags);
        if (movies.error) return this.embed.error(status, movies.error); // Error

        // Year flag
        movies.year = flags.year && /^\d{4}$/.test(flags.year) ? flags.year : 'All';;

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': this.resultDescription(movies),
            
            'fields': movies.results.map(movie => ({
                'name': movie.title,
                'value': this.joinResult([
                    `**${movie.index}**`,
                    `Vote Average: ${this.voteAverage(movie.vote_average)}`,
                    `Release: ${this.releaseDate(movie.release_date)}`,
                    `${this.TMDbID(movie.id)}`
                ])
            })),

            'footer': message.db.guild.tips ?
                'TIP: Use flags (--year, --page) to get more and accurate results.' : ''
        });
    }
}

module.exports = MoviesCommand;
