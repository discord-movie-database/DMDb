const Command = require('../handlers/commandHandler');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'PONG',
            'longDescription': 'Get latency between the bot and Discord.',
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        this.client.createMessage(message.channel.id, 'Pong!');
    }
}

module.exports = PingCommand;