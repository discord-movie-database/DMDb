import CommandStructure from '../structures/command';

/**
 * Upcoming command.
 */
class UpcomingCommand extends CommandStructure {
    /**
     * Create upcoming command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Upcoming movies in theatres.',
            usage: false,
            flags: ['page'],
            developerOnly: false,
            hideInHelp: false,
            weight: 120,
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
        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check message for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get API options.
        const options = this.APIOptions(guildSettings, { page: flags.page || message.content });

        // Get response from API.
        const response = await this.tmdb.movie.upcoming(options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: 'Upcoming Movies',
            url: 'https://www.themoviedb.org/movie/upcoming',

            thumbnail: { url: this.thumbnailURL(response.results[0].poster_path) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) => this.fields.renderResult(this.fields.check(result.title), [
                `Vote Average: ${this.fields.check(result.vote_average)}`,
                `Release Date: ${this.fields.date(result.release_date)}`,
                this.fields.TMDbID(result.id)
            ], result.index)),
        });
    }
}

export default UpcomingCommand;
