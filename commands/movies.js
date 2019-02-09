const Command = require('../handlers/commandHandler');

class MoviesCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for movies.',
            'longDescription': 'Multiple movies with the same name? Search for more than one movie.\n' +
                'Use the **IMDb ID** or **TMDb ID** with the `movie` command to get more detailed information about it.\n\n' +
                'Use **flags** to get even more and accurate results.\nAvailable flags for this command: `page`, `year`.\n\n' +
                'Examples:\n`prefix#movies Thor --page 2`\n`prefix#movies Thor --page 3 --year 2015`',
            'usage': '<Movie Name>',
            'weight': 60,
            'visible': true,
            'restricted': false
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

        const year = flags.year && /^\d{4}$/.test(flags.year)
            ? flags.year : 'All';

        // Get movies from API
        const movies = await this.api.dmdb.getMovies(flags);
        if (movies.error) return this.embed.error(status, movies.error); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Current Page: **${movies.page}** **|**` +
                ` Total Pages: ${movies.total_pages} **|**` + 
                ` Total Results: ${movies.total_results} **|**` +
                ` Year: ${year}`,
            
            'fields': movies.results.map(movie => ({
                'name': movie.title,
                'value': `**${movie.index}** **|** ` +
                    `Vote Average: ${this.voteAverage(movie.vote_average)} **|** ` +
                    `Release: ${this.releaseDate(movie.release_date)} **|** ` +
                    `${this.TMDbID(movie.id)}`
            })),

            'footer': message.db.guild.tips ?
                'TIP: Use flags (--year, --page) to get more and accurate results.' : ''
        });
    }
}

module.exports = MoviesCommand;