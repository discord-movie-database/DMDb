const template = require('./template.js');

class optionToggleCommand extends template {
    constructor(client) {
        super(client, {
            'name': 'togglecommand',
            'description': 'Disable or enable any command and hide it from command list.',
            'usage': '<command name>'
        });
    }

    async process(message) {
        const command = message.arguments[0];
        if (!command) return this.embed.error(message.channel.id, 'Command to toggle required.');

        if (!this.client.commands[command])
            return this.embed.error(message.channel.id, 'Command not found.');

        if (command === 'config')
            return this.embed.error(message.channel.id, 'You cannot disable this command.');

        const guild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id);

        const toggle = guild.disabledCommands &&
            guild.disabledCommands.indexOf(command) > -1 ? true : false;

        const updatedGuild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id, {
            [toggle ? '$pull' : '$push']: { 'disabledCommands': command } });
        if (updatedGuild) return this.embed.success(message.channel.id,
            `${toggle ? 'Enabled' : 'Disabled'} command \`${command}\`.`);

        this.embed.error(message.channel.id, 'Unable to toggle command.');
    }
}

module.exports = optionToggleCommand; 
