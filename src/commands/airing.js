import CommandStructure from '../structures/command';

/**
 * Airing command. Get a list of TV shows that are airing today.
 */
class AiringCommand extends CommandStructure {
    /**
     * Create airing command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'TV shows that are airing today.',
            usage: false,
            flags: ['page'],
            developerOnly: false,
            hideInHelp: false,
            weight: 150,
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

        // Get airing TV shows from API.
        const response = await this.tmdb.tv.airing(flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: 'TV Shows Airing Today (EST)',
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].poster_path, true),

            // Format results.
            fields: response.results.map((show) => this.resultField(show.name, [
                `Vote Average: ${this.check(show.vote_average)}`,
                `First Air Date: ${this.date(show.first_air_date)}`,
                this.TMDbID(show.id)
            ], show.index)),
        });
    }
}

export default AiringCommand;
