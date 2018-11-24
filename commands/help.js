const Command = require('../handlers/commandHandler');

class InfoCommand extends Command {
    constructor(client) {
        super(client, {
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
        const command = this.client.commands[commandName].info;

        // Command information embed
        this.embed.create(message.channel.id, {
            'title': `Command: ${commandName.charAt(0).toUpperCase() + commandName.slice(1)}`,
            'description': command.longDescription ||
                           command.shortDescription ||
                           'No description for this command.',
            'fields': [{
                'name': 'Visible',
                'value': this.yesno(command.visible || false),
                'inline': true
            }, {
                'name': 'Restricted',
                'value': this.yesno(command.restricted || false),
                'inline': true
            }, {
                'name': 'Usage Count',
                'value': `${command.usageCount}`,
                'inline': true
            }]
        });
    }

    commandList(message, pagePosition) {
        pagePosition = pagePosition ? parseInt(pagePosition) : 1;

        // Embed template
        const embed = {
            'title': 'Discord Movie Database',
            'description': `Use \`${message.prefix}help [Page Number]\` for more commands. ` +
                `Or \`${message.prefix}help [Command Name]\` ` +
                `to get more detailed information about a command.\n`,
            'fields': []
        };

        // Filter commands. Hidden / Restricted
        const commands = Object.keys(this.client.commands).filter((commandName) =>
            this.client.commands[commandName].info.visible).sort((a, b) =>
                this.client.commands[b].info.weight - this.client.commands[a].info.weight);
        
        const pages = this.util.chunkArray(commands, 5);
        const page = pages[pagePosition - 1];

        if (page.length === 0)
            return this.embed.error(message.channel.id, 'Page not found.');

        // Filtered commands
        for (let i = 0; i < page.length; i++) {
            const commandName = page[i];
            const command = this.client.commands[commandName].info;

            // Append commands to response
            embed.fields.push({
                'name': `${message.prefix}${commandName} ${command.usage || ''}`,
                'value': `- ${command.shortDescription}`
            });
        }

        embed.footer = `Page: ${(pagePosition)}/${pages.length} | Total Commands: ${commands.length}`;

        // Response
        this.embed.create(message.channel.id, embed);
    }

    async process(message) {
        const argument = message.arguments[0];

        if (!argument) return this.commandList(message);
        if (/\d+/.test(argument)) return this.commandList(message, argument);

        this.commandDescription(message);
    }
}

module.exports = InfoCommand;