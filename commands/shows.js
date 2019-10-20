import CommandStructure from '../structures/command';

class ShowsCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Search for TV shows.',
            usage: '<TV Show Name>',
            flags: ['page', 'year'],
            visible: true,
            restricted: false,
            weight: 450
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const TVShows = await this.tmdb.getTVShows(flags);
        if (TVShows.error) return this.embed.error(status, TVShows.error);

        TVShows.year = flags.year && /^\d{4}$/.test(flags.year) ? flags.year : 'All';;

        this.embed.edit(status, {
            title: 'Search Results',
            description: this.resultDescription(TVShows),
            
            fields: TVShows.results.map(TVShow => ({
                name: TVShow.name,
                value: this.joinResult([
                    `**${TVShow.index}**`,
                    `Vote Average: ${this.voteAverage(TVShow.vote_average)}`,
                    `First Air Date: ${this.releaseDate(TVShow.first_air_date)}`,
                    `${this.TMDbID(TVShow.id)}`
                ])
            })),

            footer: message.db.guild.tips ?
                `TIP: Use flags (--year, --page) to get more and accurate results.` : ''
        });
    }
}

export default ShowsCommand;
