import CommandStructure from '../structures/command';

class HelpCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get a list of commands or information for a specific command.',
            usage: '[Command Name]',
            flags: ['page'],
            visible: false,
            restricted: false,
            weight: 0
        });

        this.flagOptions = this.client.util.getUtil('flags').flags;
    }

    formatFlag(flag) {
        return `[${this.flagOptions[flag].requiresArguments ? `--${flag} <#>` : `--${flag}`}]`;
    }

    formatFlags(flags) {
        return flags ? flags.map(flag => this.formatFlag(flag)).join(' ') : false;
    }

    commandDescription(message) {
        const commandName = message.arguments[0] ? message.arguments[0].toLowerCase() : false;

        if (!this.client.commands[commandName]) return this.embed.error(message.channel.id, 'Command not found.');

        const command = this.client.commands[commandName].meta;

        this.embed.create(message.channel.id, {
            title: `${this.capitaliseStart(commandName)} Command`,
            description: `${command.description || 'No description available for this command.'}\n`,
            
            fields: [
                { name: 'Usage', value: command.usage || 'N/A', inline: false },
                { name: 'Flags', value: this.formatFlags(command.flags) || 'N/A', inline: false },
                { name: 'Visible', value: this.yesno(command.visible), inline: true },
                { name: 'Restricted', value: this.yesno(command.restricted), inline: true },
                { name: 'Executed', value: `${command.executed}`, inline: true }
            ]
        });
    }

    commandList(message, pagePosition) {
        pagePosition = pagePosition ? parseInt(pagePosition) : 1;

        const embed = {
            title: 'DMDb - Discord Movie Database',
            description: `> Use **\`${message.db.guild.prefix}help [Page Number]\`** for more commands.\n` +
                `> Or **\`${message.db.guild.prefix}help [Command Name]\`** to get more information about a command.\n` +
                '\nExample Command: `!?movies thor --page 2 --year 2011`\n' +
                `Use the \`${message.db.guild.prefix}flags\` command to learn how to use them.\n\nCommand List:`,
            fields: []
        };

        let commands = Object.keys(this.client.commands);
        commands = commands.filter((command) => this.client.commands[command].meta.visible);
        commands = commands.sort((a, b) => this.client.commands[b].meta.weight - this.client.commands[a].meta.weight);
        
        const pages = this.util.chunkArray(commands, 6);
        const page = pages[pagePosition - 1];

        if (!page) return this.embed.error(message.channel.id, 'Page not found.');

        for (let i = 0; i < page.length; i++) {
            const commandName = page[i];
            const command = this.client.commands[commandName].meta;

            embed.fields.push({
                name: `${message.db.guild.prefix}${commandName} ${command.usage || ''} ` +
                    `${this.formatFlags(command.flags) || ''}`,
                value: `- ${command.description}`
            });
        }

        embed.footer = this.joinResult([
            `Page: ${(pagePosition)}/${pages.length}`,
            `Commands: ${commands.length}`,
            `Data from The Movie Database (TMDb)`
        ], true);

        this.embed.create(message.channel.id, embed);
    }

    async process(message) {
        let query = message.arguments.join(' ');

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const page = query.length > 0 ? query : flags.page;

        if (!page) return this.commandList(message);
        if (/\d+/.test(page)) return this.commandList(message, parseInt(page));

        this.commandDescription(message);
    }
}

export default HelpCommand;
