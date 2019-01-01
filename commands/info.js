const Command = require('../handlers/commandHandler');

class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Information about the bot.',
            'longDescription': 'Useful statistics to help the developer and satisfy curious users.',
            'visible': true,
            'restricted': false,
            'weight': 5
        });

        this.package = require('../package.json');
    }

    async process(message) {
        const shardId = message.channel.guild ?
            ` (Current: ${message.channel.guild.shard.id})` : '';

        // Response
        this.embed.create(message.channel.id, {
            'title': 'DMDb Information',
            'description': '[Invite Bot](https://bit.ly/2PXWYLR) | \
[Support Server](https://discord.gg/fwAxQjV) | \
[GitHub](https://github.com/Dumplingsr/DMDb)',
            'fields': [{
                'name': 'Developer',
                'value': 'Dumplings#7460'
            }, {
                'name': 'Library',
                'value': `Eris ${this.package.dependencies.eris}`
            }, {
                'name': 'Shards',
                'value': `${this.client.shards.size}${shardId}`
            }, {
                'name': 'Guilds',
                'value': `${this.client.guilds.size}`
            }, {
                'name': 'Channels',
                'value': `${Object.keys(this.client.channelGuildMap).length}`
            }, {
                'name': 'Users',
                'value': `${this.client.users.size}`
            }, {
                'name': 'Commands Executed',
                'value': this.client.stats.totalUsageCount + 1
            }].map((field) => ({ ...field, 'inline': true })),
            'footer': 'Data sourced from The Movie Database'
        });
    }
}

module.exports = InfoCommand;