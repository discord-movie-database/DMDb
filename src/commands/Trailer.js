import Command from '../structures/Command';

/**
 * Trailer command.
 */
export default class Trailer extends Command {
    /**
     * Creates an instance of Trailer.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'trailer',
            aliases: null,
            description: 'Get the trailer for a movie or TV show.',
            arguments: '<query | tmdb id>',
            flags: ['show', 'page', 'year', 'all'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 250,
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

            const flags = this.flags.parse(commandArgs, this.meta.flags, {
                all: { argsRequired: false },
            });

            const options = { ...this.defaultOptions(guildSettings), year: flags.year };
            const method = { externalId: flags.output, query: flags.output };

            const response = await this.getMediaFromMethod(flags, method, options)
                .then((media) => media.getDetails({ ...options, append_to_response: 'videos' }))
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            const videos = response.videos.results;

            if (!flags.all || videos.total_results === 1) {
                const video = videos.results[0];
                const source = this.data.videoSourceURL(video.site, video.key);

                return this.embed.edit(statusMessage, { content: source });
            }

            return this.embed.info(statusMessage, {
                url: flags.show ? this.data.showURL(response.id) : this.data.movieURL(response.id),
                thumbnail: { url: this.data.imageURL(response.poster_path) },

                title:
                    `Trailers & More for ${response.title || response.name}` +
                    ` (${this.data.year(response.release_date || response.first_air_date)})`,

                description: this.fields.renderResultsSummary(videos),
                fields: this.fields.renderResults(videos.results, (result) => ({
                    name: result.name,
                    value: [result.index, this.data.videoSourceURL(result.site, result.key)],
                })),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
