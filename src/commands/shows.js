import CommandStructure from '../structures/command';

/**
 * Shows command.
 */
class ShowsCommand extends CommandStructure {
    /**
     * Create shows command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Search for TV shows.',
            usage: '<Query>',
            flags: ['page', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 450,
            aliases: ['programs']
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

        // Get API options.
        const options = this.APIOptions(guildSettings, {});

        // Get results from API.
        const response = await this.tmdb.search.tv(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Validate year flags.
        response.year = this.flags.year(flags.year);

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: 'Search Results',
            url: 'https://www.themoviedb.org/discover/tv',

            thumbnail: { url: this.thumbnailURL(response.results[0].poster_path) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) => this.resultField(this.check(result.name), [
                `Vote Average: ${this.check(result.vote_average)}`,
                `First Air Date: ${this.date(result.first_air_date)}`,
                this.TMDbID(result.id),
            ], result.index)),
        });
    }
}

export default ShowsCommand;
