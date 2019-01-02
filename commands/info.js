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
            'description': '[Invite Bot](https://bit.ly/2PXWYLR) | ' +
                '[Support Server](https://discord.gg/fwAxQjV) | ' +
                '[Source Code](https://github.com/Dumplingsr/DMDb) | ' +
                '[Vote](https://discordbots.org/bot/412006490132447249/vote)',
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
                'name': 'Uptime',
                'value': this.uptime(),
                'inline': false
            }, {
                'name': 'Commands Executed',
                'value': this.client.stats.totalUsageCount + 1
            }].map((field) => ({ ...field,
                'inline': typeof field.inline === 'boolean' ? field.inline : true })),
            'footer': 'Data provided by The Movie Database (TMDb)'
        });
    }
}

module.exports = InfoCommand;