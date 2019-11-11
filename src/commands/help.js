import CommandStructure from "../structures/command";

/**
 * Help command.
 */
class HelpCommand extends CommandStructure {
    /**
     * Create help command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get a list of commands or information for a specific command.',
            usage: '[Command Name]',
            flags: ['page'],
            developerOnly: false,
            hideInHelp: true,
            weight: 0
        });
    }

    /**
     * Format flags into string.
     * 
     * @param {Array} flags Flags to format
     * @returns {(String | Boolean)} Formatted flags
     */
    formatFlags(flags) {
        return flags ? flags.map((flag) => {
            return `[${this.flags.flagOptions[flag].argRequired ? `--${flag} <#>` : `--${flag}`}]`;
        }).join(' ') : false;
    }

    /**
     * Get info for a command.
     * 
     * @param {*} message Message object
     * @param {*} commandName Command name
     */
    commandInfo(message, commandName) {
        // Format command name.
        commandName = message.content.toLowerCase();

        // Get command.
        const command = this.client.command.getCommand(commandName);
        if (!command) return this.embed.error(message.channel.id, 'Command not found.');

        // Send command info.
        this.embed.create(message.channel.id, {
            title: `${this.titleCase(commandName)} Command`,
            description: `${command.meta.description || 'No description.'}\n`,
            
            fields: [
                { name: 'Usage', value: command.meta.usage || 'N/A', inline: false },
                { name: 'Flags', value:
                    this.formatFlags(command.meta.flags) || 'N/A', inline: false },
                { name: 'Hide in Help', value: this.yesno(command.meta.hideInHelp), inline: true },
                { name: 'Developer Only', value:
                    this.yesno(command.meta.developerOnly), inline: true },
            ],
        });
    }

    /**
     * Get a list of commands.
     * 
     * @param {Object} message Message object
     * @param {Object} guildSettings Guild settings
     * @param {Number} page Page number
     */
    commandList(message, guildSettings, page) {
        // Page number.
        page = page ? page - 1 : 0;
        
        // Get commands.
        const commands = this.client.command.commands;
        let commandNames = Object.keys(commands);

        // Filter commands.
        commandNames = commandNames.filter((commandName) => {
            return !commands[commandName].meta.hideInHelp; });

        // Sort commands.
        commandNames = commandNames.sort((a, b) => {
            return commands[b].meta.weight - commands[a].meta.weight; });

        // Put commands into pages.
        const commandPages = this.splitArray(commandNames, 5);

        // Get commands in page.
        const pageCommands = commandPages[page];
        if (!pageCommands) return this.embed.error(message.channel.id, 'Page not found.');

        // Get guild prefix.
        const prefix = guildSettings.prefix || this.client.config.prefix;

        // Embed object
        const embed = {
            title: 'DMDb - Discord Movie Database',
            description: `> Use **\`${prefix}help [Page Number]\`** for more commands.\n` +
                `> Or **\`${prefix}help [Command Name]\`** to get more information about a command.\n` +
                '\nExample Command: `!?movies thor --page 2 --year 2011`\n' +
                `Use the \`${prefix}flags\` command to learn how to use them.\n\nCommand List:`,

            fields: [],

            footer: this.join([
                `Page: ${page + 1}/${commandPages.length}`,
                `Total Commands: ${commandNames.length}`,
                `Data from The Movie Database (TMDb)`
            ], true),
        };

        // Put commands into embed fields.
        for (let i = 0; i < pageCommands.length; i++) {
            const commandName = pageCommands[i];
            const commandMeta = commands[commandName].meta;

            // Format command.
            embed.fields.push({
                name: `${prefix}${commandName} ${commandMeta.usage || ''} ` +
                    `${this.formatFlags(commandMeta.flags) || ''}`,
                value: `**-** ${commandMeta.description}`
            });
        }

        // Send command list embed.
        this.embed.create(message.channel.id, embed);
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message Message object
     * @param {*} commandArguments Command arguments
     * @param {*} guildSettings Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);

        // Check for arguments.
        if (message.content.length > 0) {
            // Flag page.
            if (flags.page) return this.commandList(message, guildSettings, flags.page);
            // Page.
            if (/\d+/.test(message.content))
                return this.commandList(message, guildSettings, message.content);

            // No page.
            this.commandInfo(message, message.content);
        } else {
            // No arguments.
            this.commandList(message, guildSettings, 1);
        }
    }
}

export default HelpCommand;
