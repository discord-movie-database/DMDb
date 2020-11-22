import Command from '../structures/Command';

/**
 * Help command.
 */
export default class Help extends Command {
    /**
     * Creates an instance of Help.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: null,
            description: 'Get a list of commands or information for a specific command.',
            arguments: '[cmd name | page num]',
            flags: ['page'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: true,
            weight: 0,
        });
    }

    /**
     * Runs when the command is executed.
     *
     * @param {Object} message Message data
     * @param {string} commandArgs Command arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async execute(message, commandArgs, guildSettings) {
        try {
            const flags = this.flags.parse(commandArgs, this.meta.flags);

            if (commandArgs) {
                if (flags.page) return this.commandList(message, guildSettings, flags.page);

                if (/\d+/.test(commandArgs))
                    return this.commandList(message, guildSettings, commandArgs);

                return this.commandInfo(message, commandArgs);
            }

            return this.commandList(message, guildSettings, 1);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Formats flags into string.
     *
     * @param {Array<string>} flags Flags to format
     * @returns {string}
     */
    formatFlags(flags) {
        const formatted = flags.map((flagName) => {
            const flag = this.flags.flags[flagName];

            return `[${flag.argsRequired ? `--${flagName} <#>` : `--${flagName}`}]`;
        });

        return formatted.join(' ');
    }

    /**
     * Returns a list of commands.
     *
     * @param {Object} message Message data
     * @param {Object} guildSettings Guild settings
     * @param {number} pageNumber Page number
     * @returns {Promise<undefined>}
     */
    commandList(message, guildSettings, pageNumber) {
        pageNumber = pageNumber ? pageNumber - 1 : 0;

        let { commands } = this.client.command;

        commands = commands.filter((command) => !command.meta.hideInHelp);
        commands = commands.sort((a, b) => b.meta.weight - a.meta.weight);

        commands = commands.filter((command) => {
            return !(guildSettings.disabled_cmds.indexOf(command.meta.name) > -1);
        });

        const pages = this.data.split(commands, 5);

        const page = pages[pageNumber];
        if (!page) return this.embed.error(message, `Provide a number from 1 to ${pages.length}.`);

        const prefix = guildSettings.prefix || this.client.config.prefix;

        const pageSummary = this.data.join([
            `Current Page: **${pageNumber + 1}**`,
            `Total Pages: ${pages.length}`,
            `Total Commands: ${commands.length}`,
        ]);

        const embed = {
            title: 'Discord Movie Database (DMDb)',

            description:
                `Use \`${prefix}help [Page Number]\` to discover more commands.\n` +
                `Use \`${prefix}help [Command Name]\` for information about a command.\n` +
                `\nExample Command: \`!?movies avengers --page 2 --year 2011\`\n\n${pageSummary}`,

            fields: [],

            timestamp: new Date().toISOString(),

            footer: { text: `Data provided by The Movie Database (TMDb)` },
        };

        for (let i = 0; i < page.length; i += 1) {
            const command = page[i];

            embed.fields.push({
                name:
                    `${prefix}${command.meta.name} ${command.meta.arguments || ''} ` +
                    `${command.meta.flags ? this.formatFlags(command.meta.flags) : ''}`,
                value: `**-** ${command.meta.description}`,
            });
        }

        return this.embed.info(message, embed);
    }

    /**
     * Returns the info for a specific command.
     *
     * @param {Object} message Message data
     * @param {string} commandName Command name
     * @returns {Promise<undefined>}
     */
    commandInfo(message, commandName) {
        commandName = commandName.toLowerCase();

        const command = this.client.command.findCommand(commandName);
        if (!command) return this.embed.error(message, `Command not found.`);

        return this.embed.info(message, {
            title: `${this.data.titleCase(commandName)} Command`,
            description: `${command.meta.description || 'No description available.'}\n`,

            fields: [
                {
                    name: 'Arguments',
                    value: command.meta.arguments || 'N/A',
                    inline: false,
                },

                {
                    name: 'Aliases',
                    value: command.meta.aliases ? this.data.list(command.meta.aliases) : 'N/A',
                    inline: false,
                },

                {
                    name: 'Flags',
                    value: command.meta.flags ? this.formatFlags(command.meta.flags) : 'N/A',
                    inline: false,
                },

                {
                    name: 'Hidden in Help?',
                    value: this.data.yesno(command.meta.hideInHelp),
                    inline: true,
                },

                {
                    name: 'Developer Only?',
                    value: this.data.yesno(command.meta.developerOnly),
                    inline: true,
                },
            ],
        });
    }
}
