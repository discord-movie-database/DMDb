const Command = require('../helpers/command');

class PosterCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get a movie\'s poster.',
            'usage': '<Movie Name or ID>',
            'flags': ['show', 'person'],
            'visible': true,
            'restricted': false,
            'weight': 400
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

        const show = flags.show; // Show flag
        const person = flags.person; // Person flag

        // Get poster from API
        const poster = show ? await this.api.dmdb.getTVShowPoster(query, 3) :
            person ? await this.api.dmdb.getPersonPoster(query, 3) :
            await this.api.dmdb.getMoviePoster(query, 3);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Response
        await this.client.createMessage(message.channel.id, '', {
            'file': poster, 'name': 'poster.jpg' });

        // Remove status message
        status.delete();
    }
}

module.exports = PosterCommand;
