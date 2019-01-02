const Command = require('../handlers/commandHandler');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        const shardId = message.channel.guild ?
            ` | ID: \`${message.channel.guild.shard.id}\`` : '';
        const latency = message.channel.guild ?
            ` | Latency: \`${message.channel.guild.shard.latency}\`` : '';

        this.client.createMessage(message.channel.id, `**PONG!**${latency}${shardId}`);
    }
}

module.exports = PingCommand;