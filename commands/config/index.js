const fs = require('fs');
const Command = require('../../helpers/command');

class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Customise the bot for your guild.',
            'usage': '[Option]',
            'flags': false,
            'visible': true,
            'restricted': false,
            'weight': 0
        });

        this.options = {};
        this.optionKeys = [];
    }

    load() {
        const optionDir = fs.readdirSync(__dirname);

        for (let i = 0; i < optionDir.length; i++) {
            if (!optionDir[i].startsWith('option')) continue;

            const optionName = this.util.removeFileExtension(optionDir[i])
                .toLowerCase().slice('option'.length);

            const Option = require(`${__dirname}/${optionDir[i]}`);
            this.options[optionName] = new Option(this.client);
        }

        this.optionKeys = Object.keys(this.options);
    }

    optionList(message) {
        this.embed.create(message.channel.id, {
            'title': 'Guild Configuration',
            'description': '<> = required, [] = optional _- Do not include the brackets._',

            'fields': this.optionKeys.map(key => ({
                'name': key,
                'value': this.options[key].info.description +
                `\nUsage: \`${message.db.guild.prefix}config ${key} ${this.options[key].info.usage || ''}\``
            }))
        });
    }

    async process(message) {
        if (!message.channel.guild)
            return this.embed.error(message.channel.id, 'This is not a guild.');

        // Check if author has permission
        if (!message.member.permission.has('manageGuild')) 
            return this.embed.error(message.channel.id, 'You do not have the `Manage Guild` Permission.');

        // Check type of argument
        let optionName = message.arguments[0] ? message.arguments[0].toLowerCase() : false;
        if (!optionName) return this.optionList(message);

        // Check if option exists
        if (!this.options[optionName])
            return this.embed.error(message.channel.id, 'Option not found.');

        message.arguments = message.arguments.slice(1);
        this.options[optionName].process(message); // Run option function
    }
}

module.exports = ConfigCommand;
