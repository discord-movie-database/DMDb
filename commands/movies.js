import CommandStructure from '../structures/command';

/**
 * Movies command. Search for movies.
 */
class MoviesCommand extends CommandStructure {
    /**
     * Create movies command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Search for movies.',
            usage: '<Movie Name>',
            flags: ['page', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 650
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

        // Get response from API.
        const response = await this.tmdb.getMovies(flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Verify year flag.
        response.year = this.flags.year(flags.year);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: 'Search Results',
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].poster_path, true),
            
            // Format results.
            fields: response.results.map((result) => this.resultField(result.title, [
                `Vote Average: ${this.check(result.vote_average)}`,
                `Release Date: ${this.date(result.release_date)}`,
                `${this.TMDbID(result.id)}`,
            ], result.index)),

            // Tip option.
            footer: guildSettings.tips
                ? 'TIP: Use flags (--year, --page) to get more results.' : '',
        });
    }
}

export default MoviesCommand;
