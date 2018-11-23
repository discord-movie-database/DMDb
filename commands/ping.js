const Command = require('../handlers/commandHandler');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        // PONG
        this.client.createMessage(message.channel.id, 'Pong!');
    }
}

module.exports = PingCommand;