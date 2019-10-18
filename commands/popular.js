import CommandStructure from '../structures/command';

class PopularCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Current popular movies on TMDb.',
            'usage': false,
            'flags': ['page', 'shows'],
            'visible': true,
            'restricted': false,
            'weight': 100
        });
    }

    async process(message) {
        // Query?
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query, this.meta.flags);
        query = flags.query;

        // Show flag
        const show = flags.shows;

        // Get movies from API
        const popular = show ? await this.api.dmdb.getPopularTVShows(flags) :
            await this.api.dmdb.getPopularMovies(flags);
        if (popular.error) return this.embed.error(popular);

        // Response
        this.embed.edit(status, {
            'title': `Currently Popular ${show ? 'TV Shows' : 'Movies'}`,
            'description': this.resultDescription(popular),

            'fields': popular.results.map((result) => ({
                'name': result.title || result.name,
                'value': this.joinResult([
                    `**${result.index}**`,
                    `${show ? 'First Air Date' : 'Release Date'}: ` +
                        `${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            }))
        });
    }
}

export default PopularCommand;
