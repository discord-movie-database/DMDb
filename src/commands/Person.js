import Command from '../structures/Command';

/**
 * Person command.
 */
export default class Person extends Command {
    /**
     * Creates an instance of Person.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'person',
            aliases: ['actor', 'actress'],
            description: 'Get the primary information about a person.',
            arguments: '<query | tmdb id>',
            flags: ['template'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 600,
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
            if (commandArgs.length === 0) return this.invalidArgsMessage(message);

            const statusMessage = await this.statusMessage(message);

            const flags = this.flags.parse(commandArgs, this.meta.flags);
            const options = this.defaultOptions(guildSettings);
            const method = { externalId: flags.output, query: flags.output };

            const resp = await this.client.tmdb
                .getPersonFromMethod(method, options)
                .then((person) => person.getDetails(options))
                .catch((error) => ({ error }));

            if (resp.error) return this.embed.error(statusMessage, resp.error.message);

            return this.embed.info(statusMessage, {
                url: this.data.personURL(resp.id),
                thumbnail: { url: this.data.imageURL(resp.profile_path) },

                title: this.fields.renderField('name', resp).value,
                description: this.fields.renderField('biography', resp).value,

                fields: this.fields.renderTemplate('person', resp, guildSettings, flags.template),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
