const Command = require('../helpers/command');

class PosterCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get a movie\'s poster. [Vote for higher resolution posters.](https://vote.dmdb.xyz/)',
            'documentation': true,
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

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        const show = flags.show;
        const person = flags.person;

        // Vote status
        const voted = message.db.user.voted &&
            message.db.user.voted > (new Date() - (1000 * 60 * 60 * 24 * 14)) ? true : false;
        const size = voted ? 5 : 2;

        // Get poster from API
        const poster = show ? await this.api.dmdb.getTVShowPoster(query, size) :
            person ? await this.api.dmdb.getPersonPoster(query, size) :
            await this.api.dmdb.getMoviePoster(query, size);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Response
        await this.client.createMessage(message.channel.id, '', {
            'file': poster, 'name': 'poster.jpg' });

        // Remove status message
        status.delete();
    }
}

module.exports = PosterCommand;
