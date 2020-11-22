import Command from '../structures/Command';

/**
 * Movie command.
 */
export default class Movie extends Command {
    /**
     * Creates an instance of Movie.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'movie',
            aliases: ['film'],
            description: 'Get the primary information about a movie.',
            arguments: '<query | tmdb id>',
            flags: ['year', 'template'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 700,
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
                .getMovieFromMethod(method, { ...options, year: flags.year })
                .then((movie) => movie.getDetails(options))
                .catch((error) => ({ error }));

            if (resp.error) return this.embed.error(statusMessage, resp.error.message);

            return await this.embed.info(statusMessage, {
                url: this.data.movieURL(resp.id),
                thumbnail: { url: this.data.imageURL(resp.poster_path) },

                title: this.fields.renderField('title', resp).value,
                description: this.fields.renderField('overview', resp).value,

                fields: this.fields.renderTemplate('movie', resp, guildSettings, flags.template),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
