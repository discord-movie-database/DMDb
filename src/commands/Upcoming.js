import Command from '../structures/Command';

/**
 * Upcoming command.
 */
export default class Upcoming extends Command {
    /**
     * Creates an instance of Upcoming.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'upcoming',
            aliases: null,
            description: 'Get upcoming movies in theatres.',
            arguments: null,
            flags: ['page'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 150,
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

            const response = await this.client.tmdb.movie
                .getUpcoming({ ...options, year: flags.year })
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            const first = response.results[0];

            return await this.embed.info(statusMessage, {
                url: 'https://www.themoviedb.org/movie/upcoming',
                thumbnail: { url: this.fields.imageURL(first.poster_path) },

                title: 'Upcoming Movies in Theatres',
                description: this.fields.renderResultsSummary(response),

                fields: this.fields.renderResults(response.results, {
                    name: 'title',
                    value: ['vote_average', 'release_date', 'tmdb_id'],
                }),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
