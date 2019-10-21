import CommandStructure from '../structures/command';

class CreditsCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get the cast and crew for a movie.',
            usage: '<Movie Name or ID>',
            flags: ['page', 'show', 'person'],
            visible: true,
            developerOnly: false,
            weight: 350
        });
    }

    async executeCommand(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const credits = flags.show ? await this.tmdb.getTVShowCredits(query) :
            flags.person ? await this.tmdb.getPersonCredits(query) :
            await this.tmdb.getMovieCredits(query);
        if (credits.error) return this.embed.error(status, credits.error);

        const pages = this.util.chunkArray(credits.cast, 5);
        if (flags.page > pages.length) return this.embed.error(status, 'No Results Found.');

        const cast = pages[flags.page];

        this.embed.edit(status, {
            title: credits.title || credits.name,
            description: this.joinResult([
                `Current Page: **${(flags.page + 1)}** `,
                `Total Pages: ${pages.length}`,
                `Total Results: ${credits.cast.length}`
            ]),

            thumbnail: this.thumbnail(cast[0].profile_path || cast[0].poster_path),
            
            fields: cast.map(credit => ({
                name: this.character(credit.character),
                value: flags.person ? this.joinResult([
                    `${this.mediaType(credit.media_type)}`,
                    `${credit.title || credit.name}`,
                    `Release: ${this.releaseDate(credit.release_date || credit.first_air_date)}`,
                    `${this.TMDbID(credit.id)}`]) :

                    this.joinResult([
                        `Name: ${this.name(credit.name)}`,
                        `Gender: ${this.gender(credit.gender)}`,
                        `${this.TMDbID(credit.id)}`
                    ])
            })),
            
            footer: message.db.guild.tips ?
                'TIP: Use the flags (--page, ++show, ++person) to get more results.' : ''
        });
    }
}

export default CreditsCommand;
