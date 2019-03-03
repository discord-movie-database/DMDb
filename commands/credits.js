const Command = require('../handlers/commandHandler');

class CreditsCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get the cast and crew for a movie.',
            'longDescription': 'Get a list of the cast and crew in a movie. ' +
                'Use the `--page` flag to get more results. Use the `++show` flag for a TV show.',
            'usage': '<Movie Name or ID>',
            'weight': 34,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        const page = (flags.page - 1) || 0;
        const show = flags.show;
        const person = flags.person;

        // Get credits from API
        const credits = show ? await this.api.dmdb.getTVShowCredits(query) :
            person ? await this.api.dmdb.getPersonCredits(query) :
            await this.api.dmdb.getMovieCredits(query);
        if (credits.error) return this.embed.error(status, credits.error); // Error

        // Put credits into pages
        const pages = this.util.chunkArray(credits.cast, 7);
        if (page > pages.length) return this.embed.error(status, 'No Results Found.');

        // Credits at page
        const cast = pages[page];

        // Response
        this.embed.edit(status, {
            'title': credits.title || credits.name,
            'description': `Current Page: **${(page + 1)}** **|** ` +
                `Total Pages: ${pages.length} **|** ` +
                `Total Results: ${credits.cast.length}`,
            'thumbnail': this.thumbnail(cast[0].profile_path || cast[0].poster_path),
            
            'fields': cast.map(credit => ({
                'name': this.character(credit.character),
                'value': person ? `Movie: ${credit.title} **|** ` +
                    `Release: ${this.releaseDate(credit.release_date)} **|** ` +
                    `${this.TMDbID(credit.id)}` :

                    `Name: ${this.name(credit.name)} **|** ` +
                    `Gender: ${this.gender(credit.gender)} **|** ` +
                    `${this.TMDbID(credit.id)}`
            })),
            
            'footer': message.db.guild.tips ?
                'TIP: Use the flags (--page, ++show, ++person) to get more results.' : ''
        });
    }
}

module.exports = CreditsCommand;
