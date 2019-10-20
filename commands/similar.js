import CommandStructure from '../structures/command';

class SimilarCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get similar movies.',
            usage: '<Movie Name or ID>',
            flags: ['page', 'show'],
            visible: true,
            restricted: false,
            weight: 250
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const similar = flags.show ? await this.tmdb.getSimilarTVShows(query) :
            await this.tmdb.getSimilarMovies(query);
        if (similar.error) return this.embed.error(status, similar);

        this.embed.edit(status, {
            title: `Similar ${flags.show ? 'TV Show' : 'Movie'} Results`,
            description: this.resultDescription(similar),

            fields: similar.results.map((result, index) => ({
                name: result.title || result.name,
                value: this.joinResult([
                    `**${(result.index)}**`,
                    `${flags.show ? 'First Air Date' : 'Release Date'}: ` +
                        `${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            })),

            footer: message.db.guild.tips ?
                'TIP: Use flags (--page, ++show) to get more results.' : ''
        });
    }
}

export default SimilarCommand;
