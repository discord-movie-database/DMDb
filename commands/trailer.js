const Command = require('../helpers/command');

class TrailerCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get a trailer for a movie.',
            'usage': '<Movie Name or ID>',
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 200
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const trailers = await this.api.dmdb.getTrailers(query);
        if (trailers.error) return this.embed.error(status, trailers); // Error

        // Find trailer
        const trailer = trailers[0];
        if (!trailer) return this.embed.error(status, 'No trailers found.');

        // Response
        this.embed.edit(status, `https://www.youtube.com/watch?v=${trailer.key}`);
    }
}

module.exports = TrailerCommand;
