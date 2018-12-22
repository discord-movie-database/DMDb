const Command = require('../handlers/commandHandler');

class PosterCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get a movies poster.',
            'longDescription': 'Get a large poster of a movie.',
            'usage': '<Movie Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 35
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get poster from API
        const poster = await this.api.getPoster(query, 3);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Remove status message
        await status.delete();

        // Response
        // TODO: 'Vote for the bot every 48 hours for high quality posters and to remove this message.'
        this.client.createMessage(message.channel.id, '', {
            'file': poster,
            'name': 'poster.jpg'
        });
    }
}

module.exports = PosterCommand;