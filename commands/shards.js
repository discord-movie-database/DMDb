import CommandStructure from '../structures/command';

class ShardsCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Check status of all shards.',
            'usage': false,
            'flags': false,
            'visible': false,
            'restricted': false,
            'weight': 0
        });
    }

    async process(message) {
        // Response
        this.embed.create(message.channel.id, {
            'fields': this.client.shards.map((shard) => ({
                'name': `${shard.id}`,
                'value': this.joinResult([`Status: ${this.capitaliseStart(shard.status)}`,
                    `Latency: ${shard.latency}ms`,
                    `Guilds: ${this.client.guilds.filter(guild =>
                        guild.shard.id === shard.id).length}`])
            }))
        });
    }
}

export default ShardsCommand;
