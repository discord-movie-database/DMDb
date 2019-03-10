const Command = require('../handlers/commandHandler');

class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Information about the bot.',
            'documentation': true,
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
            'description': this.joinResult([
                '[Vote](https://discordbots.org/bot/412006490132447249/vote)',
                '[Invite Bot](https://bit.ly/2PXWYLR)',
                '[Support Server](https://discord.gg/fwAxQjV)',
                '[Documentation](https://github.com/Dumblings/DMDb/wiki)',
                '[Changelog](https://github.com/Dumblings/DMDb/wiki/Changelog)',
                '[Website](https://dmdb.xyz)'
            ], true),
            'fields': [{
                'name': 'Bot Version',
                'value': this.package.version
            }, {
                'name': 'Library',
                'value': `Eris ${this.package.dependencies.eris}`
            }, {
                'name': 'Node Version',
                'value': `${process.versions.node}`
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
                'name': 'Shards',
                'value': `${this.client.shards.size}${shardId}`
            }, {
                'name': 'Commands Executed',
                'value': this.client.stats.totalUsageCount + 1
            }, {
                'name': 'Uptime',
                'value': this.uptime(),
            }].map((field) => ({ ...field,
                'inline': typeof field.inline === 'boolean' ? field.inline : true }))
        });
    }
}

module.exports = InfoCommand;
