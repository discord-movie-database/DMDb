const Command = require('../handlers/commandHandler');

class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Customise the bot for your guild.',
            'longDescription': 'Add a custom prefix, disable commands from this command.',
            'visible': true,
            'restricted': false
        });

        this.configOptions = {
            'prefix': {
                'description': 'Change the prefix to a number, letter or symbol. Example: \`!?\`',
                'usage': '<new prefix>',
                'process': this._optionPrefix
            }
            // disabledCommands
        };
        this.commandKeys = Object.keys(this.client.commands);
        this.optionKeys = Object.keys(this.configOptions);
    }

    _optionPrefix(message) {
        // TODO: Update database. 
        // regex: ^[a-z0-9!"£$%^&*()_+=\-]{1,16}$
        //
        // update messageCreate event
    }

    optionList(message) {
        this.embed.create(message.channel.id, {
            'title': 'Guild Configuration',
            'description': 'Customise the bot for this guild.',

            'fields': this.optionKeys.map((key) => ({
                'name': this.capitaliseStart(key),

                'value': this.configOptions[key].description +
                    `\nUsage: \`!?config prefix ${this.configOptions[key].usage}\``
            }))
        });
    }

    async process(message) {
        // Check if author has permission
        if (!message.member.permission.has('manageGuild')) 
            return this.embed.error('You do not have the Manage Guild Permission.');

        // Check type of argument
        const optionName = message.arguments[0];
        if (!optionName) return this.optionList(message);

        // Check if option exists
        if (!this.configOptions[optionName])
            return this.embed.error(`Option not found.`);
        
        // Run option function
        this.configOptions[optionName].process(message);
    }
}

module.exports = ConfigCommand;