const Command = require('../handlers/commandHandler');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        const latency = message.channel.guild ?
            `Shard latency: \`${message.channel.guild.shard.latency}\`` : '';
        // PONG
        this.client.createMessage(message.channel.id, `**PONG!** ${latency}`);
    }
}

module.exports = PingCommand;