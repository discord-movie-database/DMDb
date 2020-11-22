import Command from '../structures/Command';

/**
 * Shows command.
 */
export default class Shows extends Command {
    /**
     * Creates an instance of Shows.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'shows',
            aliases: null,
            description: 'Search for TV shows.',
            arguments: '<query>',
            flags: ['page', 'year'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 450,
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

            const options = {
                query: flags.output,
                page: flags.page,
                year: flags.year,

                ...this.defaultOptions(guildSettings),
            };

            const response = await this.client.tmdb.search
                .getTVShows(options)
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            const first = response.results[0];

            return await this.embed.info(statusMessage, {
                url: this.data.showSearchURL(flags.output),
                thumbnail: { url: this.fields.imageURL(first.poster_path) },

                title: `TV Show Search Results for "${flags.output}"`,
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
