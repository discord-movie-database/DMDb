import Command from '../structures/Command';

/**
 * Credits command.
 */
export default class Credits extends Command {
    /**
     * Creates an instance of Credits.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'credits',
            aliases: null,
            description: 'Get the cast for a movie, TV show or person.',
            arguments: '<query | tmdb id>',
            flags: ['page', 'year', 'show', 'person'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 350,
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
                ...this.defaultOptions(guildSettings),

                page: flags.page,
                year: flags.year,
                append_to_response: flags.person ? 'combined_credits' : 'credits',
            };
            const method = { externalId: flags.output, query: flags.output };

            const response = await this.getMediaFromMethod(flags, method, options)
                .then((media) => media.getDetails(options))
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            if (flags.person) return this.personResponse(statusMessage, response);

            if (flags.show) return this.showResponse(statusMessage, response);

            return this.movieResponse(statusMessage, response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    movieResponse(statusMessage, response) {
        const { cast } = response.credits;
        const first = cast.results[0];

        return this.embed.info(statusMessage, {
            url: this.data.movieURL(response.id),
            thumbnail: { url: this.data.imageURL(first.profile_path) },

            title: `Credits for ${response.title} (${this.data.year(response.release_date)})`,
            description: this.fields.renderResultsSummary(cast),

            fields: this.fields.renderResults(cast.results, {
                name: 'character',
                value: ['name', 'gender', 'tmdb_id'],
            }),
        });
    }

    showResponse(statusMessage, response) {
        const { cast } = response.credits;
        const first = cast.results[0];

        return this.embed.info(statusMessage, {
            url: this.data.showURL(response.id),
            thumbnail: { url: this.data.imageURL(first.profile_path) },

            title: `Credits for ${response.name} (${this.data.year(response.first_air_date)})`,
            description: this.fields.renderResultsSummary(cast),

            fields: this.fields.renderResults(cast.results, {
                name: 'character',
                value: ['name', 'gender', 'tmdb_id'],
            }),
        });
    }

    personResponse(statusMessage, response) {
        const { cast } = response.combined_credits;
        const first = cast.results[0];

        return this.embed.info(statusMessage, {
            url: this.data.personURL(response.id),
            thumbnail: { url: this.data.imageURL(response.profile_path) },

            title: `Credits for ${response.name}`,
            description: this.fields.renderResultsSummary(cast),

            fields: this.fields.renderResults(cast.results, {
                name: 'character',
                value: ['media_type', 'title_or_name', 'tmdb_id'],
            }),
        });
    }
}
