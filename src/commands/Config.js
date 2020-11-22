import Command from '../structures/Command';

/**
 * Config command.
 *
 * @prop {Object} repo Guilds repository
 * @prop {Array<Object>} options Config options
 * @prop {Array<string>} languages Supported API languages
 * @prop {Array<string>} countries Supported API countries
 */
export default class Config extends Command {
    /**
     * Creates an instance of Config.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'config',
            aliases: null,
            description: 'Customise the bot. Requires Manage Guild permission.',
            arguments: null,
            flags: ['reset'],
            toggleable: false,
            developerOnly: false,
            hideInHelp: false,
            weight: 5,
        });

        this.repo = this.client.repo.guilds;

        this.options = [
            {
                name: 'prefix',
                description: 'Change the command prefix when executing commands.',
                arguments: '<new prefix>',
                run: this.prefix,
                default: () => this.repo.defaults.prefix,
            },

            {
                name: 'toggle-mention',
                description: 'Enable or disable the mention prefix.',
                arguments: null,
                run: this.toggleMentionPrefix,
                default: () => this.repo.defaults.use_mention_prefix,
            },

            {
                name: 'toggle-command',
                description: `Enable or disable a command using it's name.`,
                arguments: '<cmd name>',
                run: this.toggleCommand,
                default: () => this.repo.defaults.disabled_cmds,
            },

            {
                name: 'toggle-disabled-message',
                description: 'Enable or disable error messages if a command is disabled.',
                arguments: null,
                run: this.toggleDisabledMessage,
                default: () => this.repo.defaults.cmd_disabled_message,
            },

            {
                name: 'toggle-aliases',
                description: 'Enable or disable command aliases.',
                arguments: null,
                run: this.toggleAliases,
                default: () => this.repo.defaults.use_aliases,
            },

            {
                name: 'api-language',
                description: 'Change the API language.',
                arguments: '<iso 639-1>',
                run: this.apiLanguage,
                default: () => this.repo.defaults.api_language,
            },

            {
                name: 'api-region',
                description: 'Change the API region.',
                arguments: '<iso 3166-1 alpha-2>',
                run: this.apiRegion,
                default: () => this.repo.defaults.api_region,
            },
        ];

        this.languages = ['en', 'de', 'fr', 'es', 'ru', 'it', 'pt', 'zh', 'hu', 'ko'];
        this.countries = ['us', 'gb', 'de', 'fr', 'es', 'ru', 'it', 'pt', 'cn', 'hu', 'kr'];
    }

    /**
     * Gets a config option using it's name.
     *
     * @param {string} optionName Option name
     * @returns {Object}
     */
    findOption(optionName) {
        for (let i = 0; i < this.options.length; i += 1) {
            const option = this.options[i];

            if (option.name === optionName) return option;
        }

        return false;
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
            if (!message.channel.guild.members.get(message.author.id).permission.has('manageGuild'))
                return this.embed.error(message, 'You do not have the `Manage Guild` permission.');

            if (!commandArgs) {
                return this.embed.info(message, {
                    title: `Cutomise the bot for ${message.channel.guild.name}`,
                    description: `Example command: \`!?config prefix !\``,

                    fields: this.options.map((option) => ({
                        name: `${option.name} ${option.arguments || ''}`,
                        value: `**-** ${option.description}`,
                    })),
                });
            }

            const flags = this.flags.parse(commandArgs, this.meta.flags);

            const configArgs = flags.output.split(' ');
            const optionName = configArgs[0];
            const optionArgs = configArgs.slice(1).join(' ');

            const option = this.findOption(optionName);
            if (!option) return this.embed.error(message, 'Option not found.');

            if (flags.reset) {
                await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                    $set: { [option.name]: option.default.bind(this)() },
                });

                return this.embed.success(message, `Reset \`${option.name}\` to default value.`);
            }

            return await option.run.bind(this)(message, optionArgs, guildSettings);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Sets the command prefix.
     *
     * @param {Object} Message Message data
     * @param {string} input New prefix
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async prefix(message, input, guildSettings) {
        try {
            if (!/^(.+){1,32}$/.test(input))
                return this.embed.error(message, 'Prefix must be between 1 and 32 characters.');

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { prefix: input },
            });

            return this.embed.success(message, `Updated prefix to \`${input}\`.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Toggles the mention prefix.
     *
     * @param {Object} message Message data
     * @param {string} input Input
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async toggleMentionPrefix(message, input, guildSettings) {
        try {
            const setting = !guildSettings.use_mention_prefix;

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { use_mention_prefix: setting },
            });

            const status = setting ? 'Enabled' : 'Disabled';

            return this.embed.success(message, `\`${status}\` mention prefix.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Toggles a command between enabled and disabled.
     *
     * @param {Object} Message Message data
     * @param {string} input Command name
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async toggleCommand(message, input, guildSettings) {
        try {
            if (!input) return this.embed.error(message, 'Command name required.');

            const command = this.client.command.findCommand(input.toLowerCase());
            if (!command) return this.embed.error(message, 'Command not found.');

            if (!command.meta.toggleable)
                return this.embed.error(message, 'This command cannot be toggled.');

            const method = guildSettings.disabled_cmds.indexOf(input) < 0 ? '$push' : '$pull';

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                [method]: { disabled_cmds: input },
            });

            const status = method === '$push' ? 'Disabled' : 'Enabled';

            return this.embed.success(message, `\`${status}\` the \`${input}\` command.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Toggles "command disabled" message.
     *
     * @param {Object} Message Message data
     * @param {string} input Input
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async toggleDisabledMessage(message, input, guildSettings) {
        try {
            const setting = !guildSettings.cmd_disabled_message;

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { cmd_disabled_message: setting },
            });

            const status = setting ? 'Enabled' : 'Disabled';

            return this.embed.success(message, `\`${status}\` command disabled message.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Toggles command alises.
     *
     * @param {Object} message Message data
     * @param {string} input Input
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async toggleAliases(message, input, guildSettings) {
        try {
            const setting = !guildSettings.use_aliases;

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { use_aliases: setting },
            });

            const status = setting ? 'Enabled' : 'Disabled';

            return this.embed.success(message, `\`${status}\` command alises.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Sets the API language.
     *
     * @param {Object} message Message data
     * @param {string} input ISO 639-1 code
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async apiLanguage(message, input, guildSettings) {
        try {
            if (!input)
                return this.embed.error(
                    message,
                    `Supported ISO 639-1 codes: ${this.data.join(this.languages)}`
                );

            if (this.languages.indexOf(input) < 0)
                return this.embed.error(message, 'Invalid ISO 639-1 code.');

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { api_language: input },
            });

            return this.embed.success(message, `Updated API language to \`${input}\`.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Sets the API region.
     *
     * @param {Object} message Message data
     * @param {string} input ISO 3166-1 alpha-2 code
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async apiRegion(message, input, guildSettings) {
        try {
            if (!input)
                return this.embed.error(
                    message,
                    `Supported ISO 3166-1 alpha-2 codes: ${this.data.join(this.countries)}`
                );

            if (this.countries.indexOf(input) < 0)
                return this.embed.error(message, `Invalid ISO 3166-1 alpha-2 code.`);

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { api_region: input },
            });

            return this.embed.success(message, `Updated API region to \`${input}\`.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
