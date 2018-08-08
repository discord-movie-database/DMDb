const Command = require('../handlers/commandHandler');

class TrailerCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get a trailer for a movie.',
            'longDescription': 'Get a trailer for a movie.',
            'usage': 'Movie Name or ID',
            'visible': true,
            'restricted': false,
            'weight': 20
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0])
            return this.embed.error(message.channel.id, `${this.info.usage} required.`);

        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Searching...' });

        // Get movie from API
        const trailers = await this.api.getTrailers(message.arguments.join(' '));
        if (trailers.error) return this.embed.error(status, trailers); // Error

        const trailer = trailers[0];

        // Response
        this.embed.edit(status, `https://www.youtube.com/watch?v=${trailer.key}`);
    }
}

module.exports = TrailerCommand;