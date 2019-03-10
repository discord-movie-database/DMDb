const Command = require('../handlers/commandHandler');

class ShardsCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });
    }

    async process(message) {
        this.embed.create(message.channel.id, {
            fields: this.client.shards.map((shard) => ({
                name: `${shard.id}`,
                value: this.joinResult([`Status: ${this.capitaliseStart(shard.status)}`,
                    `Latency: ${shard.latency}ms`,
                    `Guilds: ${this.client.guilds.filter(guild =>
                        guild.shard.id === shard.id).length}`])
            }))
        });
    }
}

module.exports = ShardsCommand;