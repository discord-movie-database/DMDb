import Command from '../structures/Command';

/**
 * Similar command.
 */
export default class Similar extends Command {
    /**
     * Creates an instance of Similar.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'similar',
            aliases: null,
            description: 'Get similar movies and TV shows.',
            arguments: '<query | tmdb id>',
            flags: ['show', 'page', 'year'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 300,
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
            const options = { ...this.defaultOptions(guildSettings), year: flags.year };
            const method = { externalId: flags.output, query: flags.output };

            const response = await this.getMediaFromMethod(flags, method, options)
                .then((media) => media.getDetails({ ...options, append_to_response: 'similar' }))
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            if (flags.show) return this.showResponse(statusMessage, response);

            return this.movieResponse(statusMessage, response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    movieResponse(statusMessage, response) {
        const first = response.similar.results[0];

        return this.embed.info(statusMessage, {
            url: this.data.movieURL(response.id),
            thumbnail: { url: this.data.imageURL(first.poster_path) },

            title: `Similar Movies for ${response.title}`,
            description: this.fields.renderResultsSummary(response.similar),

            fields: this.fields.renderResults(response.similar.results, {
                name: 'title',
                value: ['release_date', 'vote_average', 'tmdb_id'],
            }),
        });
    }

    showResponse(statusMessage, response) {
        const first = response.similar.results[0];

        return this.embed.info(statusMessage, {
            url: this.data.showURL(response.id),
            thumbnail: { url: this.data.imageURL(first.poster_path) },

            title: `Similar TV Shows for ${response.name}`,
            description: this.fields.renderResultsSummary(response.similar),

            fields: this.fields.renderResults(response.similar.results, {
                name: 'name',
                value: ['first_aired', 'vote_average', 'tmdb_id'],
            }),
        });
    }
}
