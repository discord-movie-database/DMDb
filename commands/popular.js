import CommandStructure from '../structures/command';

class PopularCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Current popular movies on TMDb.',
            usage: false,
            flags: ['page', 'shows'],
            visible: true,
            developerOnly: false,
            weight: 100
        });
    }

    async executeCommand(message) {
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const popular = flags.show ? await this.tmdb.getPopularTVShows(flags) :
            await this.tmdb.getPopularMovies(flags);
        if (popular.error) return this.embed.error(popular);

        this.embed.edit(status, {
            title: `Currently Popular ${flags.show ? 'TV Shows' : 'Movies'}`,
            description: this.resultDescription(popular),

            fields: popular.results.map((result) => ({
                name: result.title || result.name,
                value: this.joinResult([
                    `**${result.index}**`,
                    `${flags.show ? 'First Air Date' : 'Release Date'}: ` +
                        `${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            }))
        });
    }
}

export default PopularCommand;
