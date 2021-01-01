import Command from '../structures/Command';

/**
 * People command.
 */
export default class People extends Command {
    /**
     * Creates an instance of People.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'people',
            aliases: null,
            description: 'Search for people.',
            arguments: '<query>',
            flags: ['page'],
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 550,
        });
    }

    /**
     * Runs when the command is executed.
     *
     * @param {Object} message Message data
     * @param {string} cmdArguments Command arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async execute(message, cmdArguments, guildSettings) {
        try {
            if (cmdArguments.length === 0) return this.invalidArgsMessage(message);

            const statusMessage = await this.statusMessage(message);

            const flags = this.flags.parse(cmdArguments, this.meta.flags);
            const options = this.defaultOptions(guildSettings);

            const response = await this.client.tmdb.search
                .getPeople({ ...options, query: flags.output, page: flags.page })
                .catch((error) => ({ error }));

            if (response.error) return this.embed.error(statusMessage, response.error.message);

            const first = response.results[0];

            return await this.embed.info(statusMessage, {
                url: this.data.personSearchURL(flags.output),
                thumbnail: { url: this.data.imageURL(first.profile_path) },

                title: `People Search Results for "${flags.output}"`,

                description: this.fields.renderResultsSummary(response),
                fields: this.fields.renderResults(response.results, {
                    name: 'name',
                    value: ['index', 'known_for', 'tmdb_id'],
                }),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
