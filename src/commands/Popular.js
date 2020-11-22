import Command from '../structures/Command';

/**
 * Popular command.
 */
export default class Popular extends Command {
    /**
     * Creates an instance of Popular.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'popular',
            aliases: null,
            description: 'Get popular movies and TV shows.',
            arguments: null,
            flags: ['show', 'page'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 100,
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
            const statusMessage = await this.statusMessage(message);

            const flags = this.flags.parse(commandArgs, this.meta.flags);
            const options = this.defaultOptions(guildSettings);

            const response = await this.getMediaEndpoint(flags)
                .getPopular({ ...options, page: flags.page })
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            if (flags.show) return this.showResponse(statusMessage, response);

            return this.movieResponse(statusMessage, response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    movieResponse(statusMessage, response) {
        const first = response.results[0];

        return this.embed.info(statusMessage, {
            url: 'https://www.themoviedb.org/movie',
            thumbnail: { url: this.data.imageURL(first.poster_path) },

            title: 'Popular Movies',

            description: this.fields.renderResultsSummary(response),
            fields: this.fields.renderResults(response.results, {
                name: 'title',
                value: ['vote_average', 'release_date', 'tmdb_id'],
            }),
        });
    }

    showResponse(statusMessage, response) {
        const first = response.results[0];

        return this.embed.info(statusMessage, {
            url: 'https://www.themoviedb.org/tv',
            thumbnail: { url: this.data.imageURL(first.poster_path) },

            title: 'Popular TV Shows',

            description: this.fields.renderResultsSummary(response),
            fields: this.fields.renderResults(response.results, {
                name: 'title',
                value: ['vote_average', 'first_aired', 'tmdb_id'],
            }),
        });
    }
}
