const Command = require('../handlers/commandHandler');

class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': false
        });

        this.wikiURL = 'https://github.com/Dumblings/DMDb/wiki';
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
            'title': `${this.capitaliseStart(commandName)} Command`,
            'description': `${command.description || 'No description available for this command.'} ` +
                `[Read the full documentation.](${command.documentation ?
                    `${this.wikiURL}/${this.capitaliseStart(commandName)}-command)` :
                        'No documentation available for this command.'}`,
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
            'title': 'DMDb - The Discord Movie Database',
            'description': `> Use **\`${message.db.guild.prefix}help [Page Number]\`** for more commands.\n` +
                `> Or **\`${message.db.guild.prefix}help [Command Name]\`** to get more information about a command.\n` +
                '\nExample Command: `!?movies thor --page 2 --year 2011`\n' + 
                `[Click here](${this.wikiURL}) to read the full documention.\n` +
                `\nCommand List:`,
            'fields': []
        };

        // Filter commands. Hidden / Restricted
        const commands = Object.keys(this.client.commands).filter((commandName) =>
            this.client.commands[commandName].info.visible).sort((a, b) =>
                this.client.commands[b].info.weight - this.client.commands[a].info.weight);
        
        const pages = this.util.chunkArray(commands, 7);
        const page = pages[pagePosition - 1];

        if (!page) return this.embed.error(message.channel.id, 'Page not found.');

        // Filtered commands
        for (let i = 0; i < page.length; i++) {
            const commandName = page[i];
            const command = this.client.commands[commandName].info;

            // Append commands to response
            embed.fields.push({
                'name': `${message.db.guild.prefix}${commandName} ${command.usage || ''}`,
                'value': `- ${command.description}`
            });
        }

        // Page information
        embed.footer = this.joinResult([
            `Page: ${(pagePosition)}/${pages.length}`,
            `Total Commands: ${commands.length}`,
            `Data from The Movie Database (TMDb)`
        ], true);

        // Response
        this.embed.create(message.channel.id, embed);
    }

    async process(message) {
        let query = message.arguments.join(' ');

        const flags = this.util.flags(query);
        query = flags.query;

        const page = query.length > 0 ? query : flags.page;

        if (!page) return this.commandList(message);
        if (/\d+/.test(page)) return this.commandList(message, parseInt(page));

        this.commandDescription(message);
    }
}

module.exports = InfoCommand;
