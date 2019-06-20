const Command = require('../helpers/command');

class TrailerCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get a trailer for a movie.',
            'usage': '<Movie Name or ID>',
            'flags': ['show'],
            'visible': true,
            'restricted': false,
            'weight': 200
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const flags = this.util.flags(query, this.meta.flags);
        query = flags.query;

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const trailers = flags.show ? await this.api.dmdb.getTVShowTrailers(query) :
            await this.api.dmdb.getMovieTrailers(query);
        if (trailers.error) return this.embed.error(status, trailers); // Error

        // Find trailer
        const trailer = trailers[0];

        // Response
        this.embed.edit(status, `https://www.youtube.com/watch?v=${trailer.key}`);
    }
}

module.exports = TrailerCommand;
