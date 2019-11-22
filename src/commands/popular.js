import CommandStructure from '../structures/command';

/**
 * Popular command.
 */
class PopularCommand extends CommandStructure {
    /**
     * Create popular command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Current popular movies and TV shows on TMDb.',
            usage: false,
            flags: ['page', 'tv'],
            developerOnly: false,
            hideInHelp: false,
            weight: 100
        });
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get media source.
        const media = this.mediaSource(flags);

        // Get options from API.
        const options = this.APIOptions(guildSettings, { page: flags.page });

        // Get results from API.
        const response = await this.tmdb[media].popular(options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: `Currently Popular ${flags.show ? 'TV Shows' : 'Movies'}`,
            url: flags.show ? 'https://www.themoviedb.org/tv' : 'https://www.themoviedb.org/movie',

            thumbnail: { url: this.thumbnailURL(response.results[0].poster_path) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) => flags.show ? this.resultField(result.name, [
                // Show
                `First Air Date: ${this.date(result.first_air_date)}`,
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ]) : this.resultField(result.title, [
                // Movie
                `Release Date: ${this.date(result.release_date)}`,
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ])),
        });
    }
}

export default PopularCommand;
