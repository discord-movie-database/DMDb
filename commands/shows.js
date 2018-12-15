const Command = require('../handlers/commandHandler');

class ShowsCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for TV shows.',
            'longDescription': 'Multiple TV shows with the same name? Search for more than one TV show.' +
                'Use the IMDb ID or TMDb ID with the show command to get more detailed information about it.',
            'usage': '<TV Show Name>',
            'weight': 36,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movies from API
        const TVShows = await this.api.getTVShows(message.arguments.join(' '));
        if (TVShows.error) return this.embed.error(status, TVShows.error); // Error

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Current Page: **${TVShows.page}** **|**` +
                ` Total Pages: ${TVShows.total_pages} **|**` + 
                ` Total Results: ${TVShows.total_results}`,
            
            'fields': TVShows.results.map((TVShow, index) => ({
                'name': TVShow.name,
                'value': `**${(index + 1)}** **|** ` +
                    `Vote Average: ${this.voteAverage(TVShow.vote_average)} **|** ` +
                    `First Air Date: ${this.releaseDate(TVShow.first_air_date)} **|** ` +
                    `${this.TMDbID(TVShow.id)}`
            }))
        });
    }
}

module.exports = ShowsCommand;