import fs from 'fs';

import Handler from '../structures/Handler';

/**
 * Command handler.
 *
 * @prop {Object} commands Commands
 * @prop {number} executed Commands executed since load
 * @prop {string} directory Commands directory
 */
export default class Command extends Handler {
    /**
     * Creates an instance of Command.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.commands = [];
        this.executed = 0;

        this.directory = `${__dirname}/../commands`;
    }

    /**
     * Loads a command.
     *
     * @param {string} filename File name of command
     * @returns {Promise<undefined>}
     */
    async loadCommand(filename) {
        try {
            const { default: File } = await import(`${this.directory}/${filename}`);
            const command = new File(this.client);

            this.commands.push(command);
        } catch (error) {
            this.client.util.log.error(`There was an error loading ${filename}\n${error.stack}`);
        }
    }

    /**
     * Loads commands.
     *
     * @returns {Promise<undefined>}
     */
    async loadCommands() {
        const filenames = fs.readdirSync(this.directory);

        for (let i = 0; i < filenames.length; i += 1) {
            const filename = filenames[i];

            await this.loadCommand(filename);
        }

        const log = `Loaded ${this.commands.length} commands.`;
        const failedCount = filenames.length - this.commands.length;

        if (failedCount > 0) {
            this.client.util.log.warn(`${log} ${failedCount} failed to load.`);
        } else {
            this.client.util.log.success(log);
        }
    }

    /**
     * Gets a command using it's name or alias.
     *
     * @param {string} query Command name or alias
     * @param {boolean} useAliases Use aliases to find a command?
     * @returns {Object}
     */
    findCommand(query, useAliases) {
        for (let i = 0; i < this.client.command.commands.length; i += 1) {
            const command = this.client.command.commands[i];

            if (command.meta.name === query) return command;

            if (useAliases && command.meta.aliases) {
                if (command.meta.aliases.indexOf(query) > -1) return command;
            }
        }

        return false;
    }

    /**
     * Handles command execution.
     *
     * @param {Object} message Message data
     * @return {Promise<undefined>}
     */
    async executeCommand(message) {
        if (message.author.bot || !message.channel.guild) return false;

        const guildSettings = await this.client.repo.guilds
            .getOrUpdateGuild(message.channel.guild.id)
            .catch(() => this.client.repo.guilds.defaults);

        const mention = `<@!${this.client.user.id}> `;
        const prefix =
            guildSettings.use_mention_prefix && message.content.startsWith(mention)
                ? mention
                : guildSettings.prefix || this.client.config.prefix;

        if (!message.content.startsWith(prefix)) return false;

        const substrings = message.content.slice(prefix.length).trim().split(/\s+/g);
        const commandName = substrings[0].toLowerCase();
        const commandArgs = substrings.slice(1).join(' ');

        const command = this.findCommand(commandName, guildSettings.use_aliases);

        if (!command) return false;

        const developerIndex = this.client.config.developers.indexOf(message.author.id);
        if (command.meta.developersOnly && developerIndex < 0) return false;

        if (guildSettings.disabled_cmds.indexOf(commandName) > -1) {
            if (guildSettings.cmd_disabled_message) {
                return this.client.util.embed.error(message, 'This command is disabled.');
            }

            return false;
        }

        this.client.command.executed += 1;

        const log =
            `G${message.channel.guild.id} -> U${message.author.id} -> M${message.id} -> ` +
            `${commandName}${commandArgs ? ` -> ${commandArgs}` : ''}`;

        try {
            await command.execute(message, commandArgs, guildSettings);

            this.client.util.log.info(log);
        } catch (error) {
            this.client.util.log.error(`${log}\n${error.stack}`);
        }

        return true;
    }
}
