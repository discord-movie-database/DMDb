import CommandStructure from '../structures/command';

/**
 * Config command. Get information and stats about the bot.
 * 
 * @prop {Object} repository - Guilds repository
 * @prop {Object} options - Config options
 * @prop {Array<string>} languages - ISO 639-1 Codes
 * @prop {Array<string>} countries - ISO 3166-1 alpha-2 Codes
 * @prop {Object} templateParts - Keyed arrays of configurable template parts
 */
class ConfigCommand extends CommandStructure {
    /**
     * Create config command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Customise the bot for this guild. Manage Guild permission only.',
            usage: false,
            flags: false,
            developerOnly: false,
            hideInHelp: false,
            weight: 0
        });

        this.repository = this.client.repository.getRepository('guilds');

        this.options = {
            'prefix': {
                description: `Change the command prefix. `
                    + `Default: \`${this.client.config.prefix}\`.`,
                usage: '<New Prefix>',
                run: this.prefix,
            },

            'movie-fields': {
                description: 'Configure what results are returned. '
                    + 'Does not apply to `--more`.',
                usage: '<some,movie,fields,in,order>',
                run: this.setMovieTemplate,
            },

            // TODO: show-fields
            // (and maybe eventually abstract into a generic `fields <scope/command> <template,parts>`)

            'toggle-command': {
                description: 'Disable or enable a command.',
                usage: '<Command Name>',
                run: this.disabledCommands,
            },

            'command-disabled-message': {
                description: 'Toggle error message if a command is disabled. Default: `enabled`.',
                run: this.commandDisabledMessage,
            },

            'api-language': {
                type: 'string',
                description: 'Change API response language. Default: `en`.',
                usage: '<ISO 639-1 Code>',
                run: this.apiLanguage,
            },

            'api-region': {
                type: 'string',
                description: 'Change API region. Default: `us`.',
                usage: '<ISO 3166-1 alpha-2 Code>',
                run: this.apiRegion,
            },
        };

        for (let optionName in this.options) {
            this.options[optionName].run = this.options[optionName].run.bind(this);
        }

        this.languages = ['en', 'de', 'fr', 'es', 'ru', 'it', 'pt', 'zh', 'hu', 'ko'];
        this.countries = ['us', 'gb', 'de', 'fr', 'es', 'ru', 'it', 'pt', 'cn', 'hu', 'kr'];
        this.templateParts = this.discoverFieldSupports();
    }

    /**
     * Autodiscover template parts by parsing field supports.
     *
     * @returns {Object} - Keyed arrays of supported fields
     */
    discoverFieldSupports() {
        const supports = {
            movie: [],
            person: [],
            show: [],
        };

        this.fields.stubDataForSupports();

        Object.keys(this.fields.fields).map((field) => {
            this.fields.fields[field]().supports.map((f) => supports[f].push(field));
        });

        // this.client.log.info('found fields', supports);

        this.fields.clearData();

        return supports;
    }

    /**
     * Update prefix setting.
     * 
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async prefix(guildID, query, guildSettings) {
        // Check if prefix is valid
        if (!/^(.+){1,32}$/.test(query))
            return this.error('Prefix must be between 1 and 32 characters.');

        // Update prefix in database
        await this.repository.getOrUpdate(guildID, {
            $set: { prefix: query === 'reset' ? '' : query }
        });

        // Success
        return query === 'reset'
            ? this.success('Reset prefix.')
            : this.success(`Updated prefix to \`${query}\`.`);
    }

    /**
     * Update return template for a given command.
     *
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async setMovieTemplate(guildID, query, guildSettings) {
        // Check for template parts
        if (!query) return this.error(`Template parts cannot be empty. Valid parts: \`${this.fields.join(this.templateParts.movie, true)}\`.`);

        // TODO: provide some "reset" query to unset and go back to defaults?
        // TODO: provide the currently-saved template somewhere?

        // Format query
        query = query.replace(' ', '').split(',');

        // Check if template contains valid fields
        let invalid = query.filter(t => !this.templateParts.movie.includes(t));
        if (invalid.length)
            return this.error(`Invalid template part${this.fields.plural(invalid)}: ${this.fields.join(invalid)}. Valid parts: \`${this.fields.join(this.templateParts.movie, true)}\`.`);

        // Update template parts in database
        await this.repository.getOrUpdate(guildID,
            { $set: { movieTemplate: query } });

        // Success
        return this.success(`Updated movie template to: \`${this.fields.join(query, true)}\`.`);
    }

    /**
     * Update disabled commands setting.
     * 
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async disabledCommands(guildID, query, guildSettings) {
        // Check for command name to toggle
        if (!query) return this.error('Command name required.');

        // Format query
        query = query.toLowerCase();

        // Check if command exists
        if (Object.keys(this.client.command.commands).indexOf(query) < 0)
            return this.error('Command not found.');

        if (query === 'config') return this.error('This command cannot disable this command.');

        // Method type to enable to disable command
        const method = guildSettings.disabledCommands.indexOf(query) < 0 ? 'push' : 'pull';

        // Toggle command
        method === 'push' ? guildSettings.disabledCommands.push(query)
            : guildSettings.disabledCommands.pull(query);

        // Update disabled commands in database
        await this.repository.getOrUpdate(guildID,
            { $set: { disabledCommands: guildSettings.disabledCommands } });
        
        // Success
        return this.success(`\`${method === 'push' ? 'Disabled' : 'Enabled'}\` `
            + `the command \`${query}\``);
    }

    /**
     * Update command disabled message setting.
     * 
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async commandDisabledMessage(guildID, query, guildSettings) {
        // Toggle command disabled message in database
        const newValue = !guildSettings.commandDisabledMessage;
        await this.repository.getOrUpdate(guildID, { $set: { commandDisabledMessage: newValue } });

        // Success
        return this.success(`\`${newValue ? 'Enabled' : 'Disabled'}\` command disabled message.`);
    }

    /**
     * Update api language setting.
     * 
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async apiLanguage(guildID, query, guildSettings) {
        // Check for query
        if (!query) return this.error('Language code required.');

        // Check if language code is valid and exists
        if (this.languages.indexOf(query) < 0)
            return this.error(`Invalid language code. Valid codes: ${this.fields.join(this.languages)}.`);

        // Update API language in database
        await this.repository.getOrUpdate(guildID, { $set: { apiLanguage: query } });

        // Success
        return this.success(`Updated API language to \`${query}\`.`);
    }

    /**
     * Update api region setting.
     * 
     * @param {string} guildID - Guild ID
     * @param {string} query - Query
     * @param {Object} guildSettings - Guild settings
     * @returns {Object} - Success or error message
     */
    async apiRegion(guildID, query, guildSettings) {
        // Check for query
        if (!query) return this.error('Country code required.');

        // Check if language code is valid and exists
        if (this.countries.indexOf(query) < 0)
            return this.error(`Invalid country code. Valid codes: ${this.fields.join(this.countries)}.`);

        // Update API language in database
        await this.repository.getOrUpdate(guildID, { $set: { apiRegion: query } });

        // Success
        return this.success(`Updated API region to \`${query}\`.`);
    }

    /**
     * Creates an embed with config options.
     * 
     * @param {Object} message - Message object
     * @returns {Promise<Object>} - Message promise
     */
    listOptions(message) {
        // Create embed
        return this.embed.create(message.channel.id, {
            title: 'Config',
            description: 'Customise the bot for this guild.\n' +
                'Example command: `!?config prefix m!`\n' +
                '\nOption List:',

            // Config options
            fields: Object.keys(this.options).map((optionName) => ({
                name: `${optionName} ${this.options[optionName].usage || ''}`,
                value: `- ${this.options[optionName].description}`,
            })),
        });
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     * @returns {*} A bit of everything...
     */
    async executeCommand(message, commandArguments, guildSettings) {
        if (!message.channel.guild.members.get(message.author.id).permission.has('manageGuild'))
            return this.embed.error(message.channel.id, 'You do not have the `Manage Guild` permission.');

        // If there are no arguments, create option list embed.
        if (commandArguments.length === 0) return this.listOptions(message);

        // Get option info
        const optionName = commandArguments[0].toLowerCase();
        const optionArguments = commandArguments.slice(1).join(' ');

        // Check if option exists.
        const option = this.options[optionName];
        if (!option) return this.embed.error(message.channel.id, 'Option not found.');

        // Try and run option function.
        try {
            // Run option function.
            const guildID = message.channel.guild.id;
            const response = await option.run(guildID, optionArguments, guildSettings);

            // Success or error
            return response.success
                ? this.embed.success(message.channel.id, response.success)
                : this.embed.error(message.channel.id, response.error);
        } catch (error) {
            console.log(error);

            // Error
            return this.embed.error(message.channel.id, 'Try again later.');
        }
    }
}

export default ConfigCommand;
