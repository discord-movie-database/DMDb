import Command from '../structures/Command';

/**
 * Poster command.
 */
export default class Poster extends Command {
    /**
     * Creates an instance of Poster.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'poster',
            aliases: null,
            description: 'Get the poster for a movie, TV show or person.',
            arguments: '<query | tmdb id>',
            flags: ['show', 'person', 'year'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 400,
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
        if (!response.poster_path) return this.embed.error(statusMessage, 'No poster.');

        return this.embed.info(statusMessage, {
            title: `${response.title} (${this.data.year(response.release_date)})`,

            image: { url: this.data.imageURL(response.poster_path, true) },
        });
    }

    showResponse(statusMessage, response) {
        if (!response.poster_path) return this.embed.error(statusMessage, 'No poster.');

        return this.embed.info(statusMessage, {
            title: `${response.name} (${this.data.year(response.first_air_date)})`,

            image: { url: this.data.imageURL(response.poster_path, true) },
        });
    }

    personResponse(statusMessage, response) {
        if (!response.profile_path) return this.embed.error(statusMessage, 'No poster.');

        return this.embed.info(statusMessage, {
            title: `${response.name}`,

            image: { url: this.data.imageURL(response.profile_path, true) },
        });
    }
}
