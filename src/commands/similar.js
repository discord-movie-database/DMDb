import CommandStructure from '../structures/command';

/**
 * Similar command.
 */
class SimilarCommand extends CommandStructure {
    /**
     * Create similar command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get similar movies.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['page', 'show'],
            developerOnly: false,
            hideInHelp: false,
            weight: 250
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
        // Check for arguments.
        if (commandArguments.length === 0) return this.usageMessage(message);

        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get results from API.
        const response = flags.show ? await this.tmdb.tv.similar(message.content, flags) :
                                      await this.tmdb.movie.similar(message.content, flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: `Similar ${flags.show ? 'TV Show' : 'Movie'} Results`,
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].poster_path, true),

            // Format results.
            fields: response.results.map((result) => flags.show ? this.resultField(result.name, [
                `First Air Date: ${this.date(result.first_air_date)}`, // Show
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ]) : this.resultField(result.title, [ // Movie
                `Release Date: ${this.date(result.release_date)}`,
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ])),

            // Tip option.
            footer: guildSettings.tips ?
                'TIP: Use flags (--page, --show) to get more results.' : ''
        });
    }
}

export default SimilarCommand;
