import CommandStructure from '../structures/command';

/**
 * Similar command.
 */
class SimilarCommand extends CommandStructure {
    /**
     * Create similar command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get similar movies and TV shows.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['page', 'tv'],
            developerOnly: false,
            hideInHelp: false,
            weight: 250
        });
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     * @returns {*} A bit of everything...
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for arguments.
        if (commandArguments.length === 0) return this.usageMessage(message);

        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get media source.
        const media = this.mediaSource(flags);

        // Get API options.
        const options = this.APIOptions(guildSettings, { page: flags.page });

        // Get results from API.
        const response = await this.tmdb[media].similar(message.content, options, true) 
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: `Similar ${flags.tv ? 'TV Shows' : 'Movies'} ` +
                `for ${response.title || response.name}`,

            thumbnail: { url: this.thumbnailURL(response.results[0].poster_path) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) => flags.tv ? this.resultField(result.name, [
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

export default SimilarCommand;
