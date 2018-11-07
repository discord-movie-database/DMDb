const Command = require('../handlers/commandHandler');

class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Help',
            'longDescription': 'View all the bots commands and how to use them.',
            'visible': false,
            'restricted': false
        });
    }

    commandDescription(message) {
        // Get & format command name
        let commandName = message.arguments[0];
        if (commandName) commandName = commandName.toLowerCase();

        // Check if command exists
        if (!this.client.commands[commandName])
            return this.embed.error(message.channel.id, 'Command not found.');

        // Command
        const command = this.client.commands[commandName];

        // Command information embed
        this.embed.create(message.channel.id, {
            'title': `Command: ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}`,
            'description': command.info.longDescription ||
                           command.info.shortDescription ||
                           'Description is currently unavailable.',
            'fields': [{
                'name': 'Visible',
                'value': this.yesno(command.info.visible || false),
                'inline': true
            }, {
                'name': 'Restricted',
                'value': this.yesno(command.info.restricted || false),
                'inline': true }] });
    }

    commandList(message) {
        // Embed template
        const embed = {
            'title': 'Discord Movie Database',
            'description': `Use \`${message.prefix}help [Command Name]\` \
        to get more detailed information about a command.\n`,
            'fields': []
        };

        // Filter commands. Hidden / Restricted
        const commands = Object.keys(this.client.commands).sort((a, b) =>
            this.client.commands[b].info.weight - this.client.commands[a].info.weight)
                .filter((commandName) => this.client.commands[commandName].info.visible);

        // Filtered commands
        for (let i = 0; i < commands.length; i++) {
            const commandName = commands[i];
            const command = this.client.commands[commandName].info;

            // Append commands to response
            embed.fields.push({
                'name': `${message.prefix}${commandName} ${command.usage ? `<${command.usage}>` : ''}`,
                'value': `- ${this.client.commands[commands[i]].info.shortDescription}`
            });
        }

        // Response
        this.embed.create(message.channel.id, embed);
    }

    async process(message) {
        // Check for command
        if (message.arguments[0]) return this.commandDescription(message);

        // List all commands
        this.commandList(message);
    }
}

module.exports = InfoCommand;