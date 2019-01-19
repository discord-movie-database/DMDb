const Command = require('../handlers/commandHandler');

class PosterCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get a movies poster. [Vote just once a fortnight for higher resolution posters.](https://vote.dmdb.xyz/)',
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

        // Vote status
        const voted = message.db.user.voted &&
            message.db.user.voted > (new Date() - (1000 * 60 * 60 * 24 * 14)) ? true : false;

        // Get poster from API
        const poster = await this.api.dmdb.getPoster(query, voted ? 5 : 2);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Response
        await this.client.createMessage(message.channel.id, `${voted}`, {
            'file': poster, 'name': 'poster.jpg' });

        // Remove status message
        status.delete();
    }
}

module.exports = PosterCommand;