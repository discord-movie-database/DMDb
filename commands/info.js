import CommandStructure from '../structures/command';

class InfoCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Information and statistics about the bot.',
            'usage': false,
            'flags': false,
            'visible': true,
            'restricted': false,
            'weight': 50
        });

        this.package = require('../package.json');
    }

    async process(message) {
        // Response
        this.embed.create(message.channel.id, {
            'title': 'DMDb Information',
            'description': this.joinResult([
                '[Invite Bot](https://bit.ly/2PXWYLR)',
                '[Support Server](https://discord.gg/fwAxQjV)',
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
                'value': `${this.client.shards.size}`
            }, {
                'name': 'Current Shard',
                'value': message.channel.guild ? `${message.channel.guild.shard.id}` : 'N/A'
            }, {
                'name': 'Commands Executed',
                'value': this.client.stats.executed + 1
            }, {
                'name': 'Uptime',
                'value': this.uptime(),
            }].map((field) => ({ ...field,
                'inline': typeof field.inline === 'boolean' ? field.inline : true }))
        });
    }
}

export default InfoCommand;
