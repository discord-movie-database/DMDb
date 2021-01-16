import Command from '../structures/Command';

/**
 * Template command.
 *
 * @prop {Object} repo Guilds repository
 * @prop {Array<Object>} options Template options
 */
export default class Template extends Command {
    /**
     * Creates an instance of Template.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'template',
            aliases: null,
            description: 'Create custom templates.',
            arguments: null,
            flags: null,
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 0,
        });

        this.repo = this.client.repo.guilds;

        this.options = [
            {
                name: 'get',
                description: "Get's a template configuration.",
                arguments: '<template name>',
                run: this.getTemplate,
            },

            {
                name: 'create',
                description: 'Creates a new custom template.',
                arguments: '<template name> <media> <fields>',
                run: this.createTemplate,
            },

            {
                name: 'edit',
                description: 'Edits the fields for a custom template.',
                arguments: '<template name> <new fields>',
                run: this.editTemplate,
            },

            {
                name: 'delete',
                description: 'Deletes a custom template.',
                arguments: '<template name>',
                run: this.deleteTemplate,
            },

            {
                name: 'default',
                description: 'Sets a default custom template.',
                arguments: '<template name>',
                run: this.defaultTemplate,
            },
        ];
    }

    /**
     * Gets any invalid fields for a media.
     *
     * @param {Array<string>} inputFields Input fields
     * @param {string} mediaName Media name
     * @returns {Array<string>}
     */
    invalidFields(inputFields, mediaName) {
        const invalidFields = [];
        const validFields = this.fields.templates[mediaName].supports;

        for (let i = 0; i < inputFields.length; i += 1) {
            const inputField = inputFields[i];

            if (validFields.indexOf(inputField) < 0) invalidFields.push(inputField);
        }

        return invalidFields;
    }

    /**
     * Finds an option using it's name.
     *
     * @param {string} name Option name
     * @returns {Object}
     */
    findOption(name) {
        for (let i = 0; i < this.options.length; i += 1) {
            const option = this.options[i];

            if (option.name === name) return option;
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
            const prefix = guildSettings.prefix || this.client.config.prefix;
            const templateNames = guildSettings.templates.map((template) => template.name);

            if (!commandArgs) {
                return this.embed.info(message, {
                    title: 'Custom Template Editor',
                    description:
                        `\nDefault template: \`${guildSettings.default_template || 'N/A'}\`` +
                        `\nCustom templates: \`${templateNames.join(', ') || 'N/A'}\`\n` +
                        `\nExample command:\n\`${prefix}config template create money movie ` +
                        `revenue budget\``,

                    fields: this.options.map((option) => ({
                        name: `${option.name} ${option.arguments || ''}`,
                        value: `**-** ${option.description}`,
                    })),
                });
            }

            const substrings = commandArgs.split(' ');

            const optionName = substrings[0];
            const option = this.findOption(optionName);

            if (!option) return this.embed.error(message, 'Option not found.');

            const run = option.run.bind(this);
            const optionArgs = substrings.slice(1);

            return run(message, optionArgs, guildSettings);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Gets a custom template configuration.
     *
     * @param {Object} message Message data
     * @param {Array<string>} optionArgs Option arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    getTemplate(message, optionArgs, guildSettings) {
        try {
            const templateName = optionArgs[0];
            if (!templateName) return this.embed.error(message, 'Template name required.');

            const template = this.fields.findCustomTemplate(templateName, guildSettings.templates);

            if (!template)
                return this.embed.error(message, `Template \`${templateName}\` not found.`);

            const isDefault = guildSettings.default_template === templateName;

            return this.embed.info(message, {
                title: `Custom Template "${templateName}"`,
                description:
                    `Default: \`${this.data.yesno(isDefault)}\`\n` +
                    `Media: \`${template.media}\`\n` +
                    `\nFields (in order):\n\`${template.fields.join(', ')}\``,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Creates a custom template.
     *
     * @param {Object} message Message data
     * @param {Array<string>} optionArgs Option arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async createTemplate(message, optionArgs, guildSettings) {
        try {
            if (guildSettings.templates.length >= 3)
                return this.embed.error(message, 'You haved reached your custom template limit.');

            const templateName = optionArgs[0];
            if (!templateName) return this.embed.error(message, 'Template name required.');

            const template = this.fields.findCustomTemplate(templateName, guildSettings.templates);

            if (template)
                return this.embed.error(message, `Template \`${templateName}\` already exists.`);

            const mediaName = optionArgs[1];
            if (!mediaName || ['movie', 'show', 'person'].indexOf(mediaName.toLowerCase()) < 0)
                return this.embed.error(message, 'Valid media names: `<movie | show | person>`.');

            const validFields = this.fields.templates[mediaName.toLowerCase()].supports;

            const inputFields = optionArgs.slice(2).join(' ').split(/[ ,]+/);
            if (!inputFields[0])
                return this.embed.error(message, `Valid fields: \`${validFields.join(', ')}\``);

            const invalidFields = this.invalidFields(inputFields, mediaName);
            if (invalidFields.length > 0)
                return this.embed.error(message, `Invalid fields: \`${invalidFields.join(', ')}\``);

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $push: {
                    templates: {
                        name: templateName.toLowerCase(),
                        media: mediaName.toLowerCase(),
                        fields: inputFields,
                    },
                },
            });

            return this.embed.success(message, `Created the \`${templateName}\` template.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Edits a custom template.
     *
     * @param {Object} message Message data
     * @param {Array<string>} optionArgs Option arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async editTemplate(message, optionArgs, guildSettings) {
        try {
            const templateName = optionArgs[0];
            if (!templateName) return this.embed.error(message, 'Template name required.');

            const template = this.fields.findCustomTemplate(templateName, guildSettings.templates);

            if (!template)
                return this.embed.error(message, `Template \`${templateName}\` not found.`);

            const validFields = this.fields.templates[template.media].supports;

            const inputFields = optionArgs.slice(1).join(' ').split(/[ ,]+/);
            if (inputFields.length === 0)
                return this.embed.error(message, `Valid fields: \`${validFields.join(', ')}\``);

            const invalidFields = this.invalidFields(inputFields, validFields);
            if (invalidFields.length > 0)
                return this.embed.error(message, `Invalid fields: \`${invalidFields.join(', ')}\``);

            await this.repo.getOrUpdateGuild(
                {
                    id: message.channel.guild.id,
                    templates: { name: templateName.toLowerCase() },
                },

                { $set: { templates: { fields: inputFields } } }
            );

            return this.embed.success(message, `Updated the \`${templateName}\` template.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Deletes a custom template.
     *
     * @param {Object} message Message data
     * @param {Array<string>} optionArgs Option arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async deleteTemplate(message, optionArgs, guildSettings) {
        try {
            const templateName = optionArgs[0];
            if (!templateName) return this.embed.error(message, 'Template name required.');

            const template = this.fields.findCustomTemplate(templateName, guildSettings.templates);

            if (!template)
                return this.embed.error(message, `Template \`${templateName}\` not found.`);

            const isDefault = guildSettings.default_template === templateName.toLowerCase();

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $pull: { templates: { name: templateName.toLowerCase() } },

                $set: {
                    default_template: isDefault
                        ? this.repo.defaults.default_template
                        : guildSettings.default_template,
                },
            });

            return this.embed.success(message, `Deleted the \`${templateName}\` template.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Sets a custom default template.
     *
     * @param {Object} message Message data
     * @param {Array<string>} optionArgs Option arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async defaultTemplate(message, optionArgs, guildSettings) {
        try {
            const templateName = optionArgs[0];
            if (!templateName) {
                await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                    $set: { default_template: this.repo.defaults.default_template },
                });

                return this.embed.success(message, 'Reset default template.');
            }

            const template = this.fields.findCustomTemplate(templateName, guildSettings.templates);

            if (!template)
                return this.embed.error(message, `Template \`${templateName}\` not found.`);

            await this.repo.getOrUpdateGuild(message.channel.guild.id, {
                $set: { default_template: templateName.toLowerCase() },
            });

            return this.embed.success(message, `Set \`${templateName}\` as default template.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
