const Command = require('../handlers/commandHandler');

class VoteCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Vote and access more features.',
            'visible': false,
            'restricted': false,
            'weight': 0
        });
    }

    async process(message) {
        this.embed.create(message.channel.id, {
            title: 'Vote',
            description: '[Click here to vote for the bot!](https://vote.dmdb.xyz/)'
        });
    }
}

module.exports = VoteCommand;