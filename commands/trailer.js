const Command = require('../handlers/commandHandler');

class TrailerCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get a trailer for a movie.',
            'longDescription': 'Get a trailer for a movie. First video on the TMDb page will be used.',
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 20
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
        const trailer = trailers[0];

        // Response
        this.embed.edit(status, `https://www.youtube.com/watch?v=${trailer.key}`);
    }
}

module.exports = TrailerCommand;