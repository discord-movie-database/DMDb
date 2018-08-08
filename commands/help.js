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

    async process(message) {
        // Embed template
        const embed = {
            'title': 'Discord Movie Database',
            'description': `Use \`${this.config.prefix}help [Command Name]\` \
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
                'name': `${this.config.prefix}${commandName} <${command.usage}>`,
                'value': `- ${this.client.commands[commands[i]].info.shortDescription}`
            });
        }

        // Response
        this.embed.create(message.channel.id, embed);
    }
}

module.exports = InfoCommand;