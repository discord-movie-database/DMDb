import Command from '../structures/Command';

/**
 * Show command.
 */
export default class Show extends Command {
    /**
     * Creates an instance of Show.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'show',
            aliases: ['tv'],
            description: 'Get the primary information about a TV show.',
            arguments: '<query | tmdb id>',
            flags: ['year', 'template'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 500,
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
                .getTVShowFromMethod(method, { ...options, year: flags.year })
                .then((show) => show.getDetails(options))
                .catch((error) => ({ error }));

            if (resp.error) return this.embed.error(statusMessage, resp.error.message);

            return await this.embed.info(statusMessage, {
                url: this.data.showURL(resp.id),
                thumbnail: { url: this.data.imageURL(resp.poster_path) },

                title: this.fields.renderField('name', resp).value,
                description: this.fields.renderField('overview', resp).value,

                fields: this.fields.renderTemplate('show', resp, guildSettings, flags.template),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
