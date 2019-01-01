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

        this.voteMessage = 'Vote for the bot every week to remove this message and ' +
            'get posters in high resolution.\n**<https://discordbots.org/bot/412006490132447249/vote>**';
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get user vote status
        let voted = false;
        const userDB = await this.client.handlers.db.getOrUpdateUser(message.author.id);

        // Check if user has voted in the last 72 hours
        const voteTimeframe = userDB && userDB.voted ?
            userDB.voted.getTime() + (1000 * 60 * 60 * 24 * 7) : false;
        if (voteTimeframe && voteTimeframe > new Date().getTime()) voted = true;

        // Get poster from API
        const poster = await this.api.getPoster(query, voted ? 4 : 1);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Response
        await this.client.createMessage(message.channel.id, voted ? '' : this.voteMessage, {
            'file': poster, 'name': 'poster.jpg' });

        // Remove status message
        status.delete();
    }
}

module.exports = PosterCommand;