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
            'description': '**[Vote](https://discordbots.org/bot/412006490132447249/vote)** | ' +
                '[Invite Bot](https://bit.ly/2PXWYLR) | ' +
                '[Support Server](https://discord.gg/fwAxQjV) | ' +
                '[Source Code](https://github.com/Dumblings/DMDb)',
            'fields': [{
                'name': 'Developer',
                'value': 'Dumplings#7460'
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
                'name': 'Uptime',
                'value': this.uptime(),
            }, {
                'name': 'Commands Executed',
                'value': this.client.stats.totalUsageCount + 1
            }, {
                'name': 'Shards',
                'value': `${this.client.shards.size}${shardId}`
            }].map((field) => ({ ...field,
                'inline': typeof field.inline === 'boolean' ? field.inline : true })),
            'footer': `Total Commands: ${Object.keys(this.client.commands).length} | ` +
                'Data from The Movie Database (TMDb)'
        });
    }
}

module.exports = InfoCommand;