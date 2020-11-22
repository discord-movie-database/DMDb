import Command from '../structures/Command';

/**
 * Airing command.
 */
export default class Airing extends Command {
    /**
     * Creates an instance of Airing.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'airing',
            aliases: null,
            description: 'Get TV shows that are airing today.',
            arguments: null,
            flags: ['page'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 200,
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

            const response = await this.client.tmdb.tv
                .getAiringToday({ ...options, page: flags.page })
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            const first = response.results[0];

            return await this.embed.info(statusMessage, {
                url: 'https://www.themoviedb.org/tv/airing-today',
                thumbnail: { url: this.data.imageURL(first.poster_path) },

                title: 'TV Shows Airing Today (EST)',

                description: this.fields.renderResultsSummary(response),
                fields: this.fields.renderResults(response.results, {
                    name: 'name',
                    value: ['vote_average', 'first_aired', 'tmdb_id'],
                }),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
