const Command = require('../handlers/commandHandler');

class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Customise the bot for your guild.',
            'longDescription': 'Add a custom prefix, disable commands from this command.',
            'visible': true,
            'restricted': false
        });

        this.dbHandler = this.client.handlers.db;

        this.configOptions = {
            'prefix': {
                'description': 'Change the prefix to a number, letter or symbol. Example: \`!?\`',
                'usage': '<new prefix>',
                'process': this._optionPrefix.bind(this)
            },
            'togglecommand': {
                'description': 'Disable/Enable and hide any command.',
                'usage': '<command name>',
                'process': this._optionToggleCommand.bind(this)
            }
        };

        this.commandKeys = Object.keys(this.client.commands);
        this.optionKeys = Object.keys(this.configOptions);
    }

    async _optionPrefix(message) {
        const prefix = message.arguments[0];
        if (!prefix) return this.embed.error(message.channel.id, 'New prefix required.');

        const regex = /^[a-z0-9!"£$%^&*()_+=~#~@\';:.,<>?{}`|[\]\/\-]{1,16}$/i;
        if (!regex.test(prefix)) 
            return this.embed.error(message.channel.id, `Invalid prefix. Regex: \`${regex}\``);

        const updatedGuild = await this.dbHandler.updateGuild(message.channel.guild.id, {
            'prefix': prefix });

        if (updatedGuild)
            return this.embed.success(message.channel.id, `Updated prefix to \`${prefix}\``);
        this.embed.error(message.channel.id, 'Unable to update prefix.');
    }

    async _optionToggleCommand(message) {
        const command = message.arguments[0];
        if (!command) return this.embed.error(message.channel.id, 'Command to toggle required.');

        if (!this.client.commands[command])
            return this.embed.error(message.channel.id, 'Command not found.');

        const guild = await this.dbHandler.getGuild(message.channel.guild.id);

        const toggle = guild.disabledCommands &&
            guild.disabledCommands.indexOf(command) > -1 ? true : false;

        const updatedGuild = await this.dbHandler.updateGuild(message.channel.guild.id, {
            [toggle ? '$pull' : '$push']: { 'disabledCommands': command } });
        if (updatedGuild) return this.embed.success(message.channel.id,
            `${toggle ? 'Enabled' : 'Disabled'} command \`${command}\``);
        
        this.embed.error(message.channel.id, 'Unable to disable command.');
    }

    optionList(message) {
        this.embed.create(message.channel.id, {
            'title': 'Guild Configuration',
            'description': 'Customise the bot for this guild.',

            'fields': this.optionKeys.map((key) => {
                const option = this.configOptions[key];

                return {
                    'name': this.capitaliseStart(key),
                    'value': option.description +
                    `\nUsage: \`!?config ${key} ${option.usage}\``
                }
            })
        });
    }

    async process(message) {
        if (!message.channel.guild)
            return this.embed.error(message.channel.id, 'This is not a guild.');

        // Check if author has permission
        if (!message.member.permission.has('manageGuild')) 
            return this.embed.error(message.channel.id, 'You do not have the Manage Guild Permission.');

        // Check type of argument
        let optionName = message.arguments[0];
        if (!optionName) return this.optionList(message);
        optionName = optionName.toLowerCase();

        // Check if option exists
        if (!this.configOptions[optionName])
            return this.embed.error(message.channel.id, 'Option not found.');
        
        message.arguments = message.arguments.slice(1);
        // Run option function
        this.configOptions[optionName].process(message);
    }
}

module.exports = ConfigCommand;