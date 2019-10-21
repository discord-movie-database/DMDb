import packageInfo from '../package.json';

import CommandStructure from '../structures/command';

class InfoCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Information and statistics about the bot.',
            usage: false,
            flags: false,
            visible: true,
            developerOnly: false,
            weight: 50
        });
    }

    async executeCommand(message) {
        const stats = this.client.routine.getRoutine('stats');

        this.embed.create(message.channel.id, {
            title: 'DMDb Information',
            description: this.joinResult([
                '[Invite Bot](https://bit.ly/2PXWYLR)',
                '[Support Server](https://discord.gg/fwAxQjV)',
                '[Website](https://dmdb.xyz)'
            ], true),
            fields: [{
                name: 'Bot Version',
                value: packageInfo.version
            }, {
                name: 'Library',
                value: `Eris ${packageInfo.dependencies.eris}`
            }, {
                name: 'Node Version',
                value: `${process.versions.node}`
            }, {
                name: 'Guilds',
                value: `${stats.guilds()}`
            }, {
                name: 'Channels',
                value: `${stats.channels()}`
            }, {
                name: 'Users',
                value: `${stats.users()}`
            }, {
                name: 'Shards',
                value: `${this.client.shards.size}`
            }, {
                name: 'Current Shard',
                value: message.channel.guild ? `${message.channel.guild.shard.id}` : 'N/A'
            }, {
                name: 'Commands Executed',
                name: this.command.commandsExecuted + 1
            }, {
                name: 'Uptime',
                value: this.uptime(),
            }].map((field) => ({ ...field,
                inline: typeof field.inline === 'boolean' ? field.inline : true }))
        });
    }
}

export default InfoCommand;
