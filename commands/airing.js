import CommandStructure from '../structures/command';

class AiringCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'TV shows that are airing today.',
            usage: false,
            flags: ['page'],
            visible: true,
            developerOnly: false,
            weight: 150
        });
    }

    async executeCommand(message) {
        const query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);

        const airing = await this.tmdb.getTVShowsAiringToday(flags);
        if (airing.error) return this.embed.error(airing);

        this.embed.edit(status, {
            title: 'TV Shows Airing Today',
            description: this.resultDescription(airing),

            fields: airing.results.map((show) => ({
                name: show.name,
                value: this.joinResult([
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
