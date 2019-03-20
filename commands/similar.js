const Command = require('../handlers/commandHandler');

class SimilarCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get similar movies.',
            'documentation': true,
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 30
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        const flags = this.util.flags(query);
        query = flags.query;

        const show = flags.shows;

        // Get movie from API
        const similar = show ? await this.api.dmdb.getSimilarTVShows(query) :
            await this.api.dmdb.getSimilarMovies(query);
        if (similar.error) return this.embed.error(status, similar); // Error

        // Response
        this.embed.edit(status, {
            'title': `Similar ${show ? 'TV Show' : 'Movie'} Results`,
            'description': this.resultDescription(similar),

            'fields': similar.results.map((result, index) => ({
                'name': result.title || result.name,
                'value': this.joinResult([
                    `**${(result.index)}**`,
                    `${show ? 'First Air Date' : 'Release Date'}: ` +
                        `${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            })),

            'footer': message.db.guild.tips ?
                'TIP: Use flags (--page, ++show) to get more results.' : ''
        });
    }
}

module.exports = SimilarCommand;
