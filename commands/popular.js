const Command = require('../handlers/commandHandler');

class PopularCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Most popular movies on TMDb.',
            'documentation': false,
            'visible': true,
            'restricted': false,
            'weight': 10
        });
    }

    async process(message) {
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        const flags = this.util.flags(query);
        query = flags.query;

        const show = flags.shows;

        // Get movies from API
        const popular = show ? await this.api.dmdb.getPopularTVShows(flags) :
            await this.api.dmdb.getPopularMovies(flags);
        if (popular.error) return this.embed.error(popular);

        // Response
        this.embed.edit(status, {
            'title': `Popular ${show ? 'TV Shows' : 'Movies'}`,
            'description': this.resultDescription(popular),

            'fields': popular.results.map((result) => ({
                'name': result.title || result.name,
                'value': this.joinResult([
                    `**${result.index}**`,
                    `Release: ${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            }))
        });
    }
}

module.exports = PopularCommand;
