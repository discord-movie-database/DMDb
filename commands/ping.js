const Command = require('../handlers/commandHandler');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        this.embed.create(message.channel.id, {
            'title': 'Pong!',
            'fields': message.channel.guild ? this.parseEmbedFields([{
                'name': 'Shard ID',
                'value': `${message.channel.guild.shard.id}`
            }, {
                'name': 'Shard Latency',
                'value': `${message.channel.guild.shard.latency}ms`
            }]) : []
        });
    }
}

module.exports = PingCommand;