const Command = require('../helpers/command');

class CreditsCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get the cast and crew for a movie.',
            'usage': '<Movie Name or ID>',
            'flags': ['page', 'show', 'person'],
            'visible': true,
            'restricted': false,
            'weight': 350
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query, this.meta.flags);
        query = flags.query; // Update query

        const page = (flags.page - 1) || 0; // Page flag
        const show = flags.show; // Show flag
        const person = flags.person; // Person flag

        // Get credits from API
        const credits = show ? await this.api.dmdb.getTVShowCredits(query) :
            person ? await this.api.dmdb.getPersonCredits(query) :
            await this.api.dmdb.getMovieCredits(query);
        if (credits.error) return this.embed.error(status, credits.error); // Error

        // Put credits into pages
        const pages = this.util.chunkArray(credits.cast, 5);
        if (page > pages.length) return this.embed.error(status, 'No Results Found.');

        // Get credits from page position
        const cast = pages[page];

        // Response
        this.embed.edit(status, {
            'title': credits.title || credits.name,
            'description': this.joinResult([
                `Current Page: **${(page + 1)}** `,
                `Total Pages: ${pages.length}`,
                `Total Results: ${credits.cast.length}`
            ]),
            'thumbnail': this.thumbnail(cast[0].profile_path || cast[0].poster_path),
            
            'fields': cast.map(credit => ({
                'name': this.character(credit.character),
                'value': person ? this.joinResult([ // Person flag: gives information and movies or tv shows
                    `${this.mediaType(credit.media_type)}`,
                    `${credit.title || credit.name}`,
                    `Release: ${this.releaseDate(credit.release_date || credit.first_air_date)}`,
                    `${this.TMDbID(credit.id)}`]) :

                    this.joinResult([ // No person flag: gives information about people
                        `Name: ${this.name(credit.name)}`,
                        `Gender: ${this.gender(credit.gender)}`,
                        `${this.TMDbID(credit.id)}`
                    ])
            })),
            
            'footer': message.db.guild.tips ?
                'TIP: Use the flags (--page, ++show, ++person) to get more results.' : ''
        });
    }
}

module.exports = CreditsCommand;
