import CommandStructure from '../structures/command';

class AiringCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'TV shows that are airing today.',
            'usage': false,
            'flags': ['page'],
            'visible': true,
            'restricted': false,
            'weight': 150
        });
    }

    async process(message) {
        // Query?
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query, this.meta.flags);

        // Get movies from API
        const airing = await this.api.dmdb.getTVShowsAiringToday(flags);
        if (airing.error) return this.embed.error(airing);

        // Response
        this.embed.edit(status, {
            'title': 'TV Shows Airing Today',
            'description': this.resultDescription(airing),

            'fields': airing.results.map((show) => ({
                'name': show.name,
                'value': this.joinResult([
                    `**${show.index}**`,
                    `First Air Date: ${this.releaseDate(show.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(show.vote_average)}`,
                    `${this.TMDbID(show.id)}`
                ])
            }))
        });
    }
}

export default AiringCommand;
