import CommandStructure from '../structures/command';

/**
 * Upcoming command.
 */
class UpcomingCommand extends CommandStructure {
    /**
     * Create upcoming command.
     * 
     * @param {Object} client DMDb client extends Eris
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
     * @param {Object} message Message object
     * @param {*} commandArguments Command arguments
     * @param {*} guildSettings Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check message for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get response from API.
        const response = await this.tmdb.movie.upcoming(flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: 'Upcoming Movies',
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].poster_path, true),

            // Format results.
            fields: response.results.map((result) => this.resultField(result.title, [
                `Vote Average: ${this.check(result.vote_average)}`,
                `Release Date: ${this.date(result.release_date)}`,
                this.TMDbID(result.id)
            ], result.index)),
        });
    }
}

export default UpcomingCommand;
