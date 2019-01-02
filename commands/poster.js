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

        this.voteMessage = '**<https://vote.dmdb.xyz/>** - Vote for the bot just once a month ' +
            'to remove this message and get posters in higher resolution.';
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get user vote status
        let voted = false;
        const userInfo = await this.client.handlers.db.getOrUpdateUser(message.author.id);

        // Check if user has voted this month
        const voteMonth = userInfo.voted ? userInfo.voted.getUTCMonth() : false;
        const currentMonth = new Date().getUTCMonth();
        if (userInfo.voted && voteMonth === currentMonth) voted = true;

        console.log(voteMonth);

        // Get poster from API
        const poster = await this.api.getPoster(query, voted ? 3 : 1);
        if (poster.error) return this.embed.error(status, poster); // Error

        // Response
        await this.client.createMessage(message.channel.id, voted ? '' : this.voteMessage, {
            'file': poster, 'name': 'poster.jpg' });

        // Remove status message
        status.delete();
    }
}

module.exports = PosterCommand;