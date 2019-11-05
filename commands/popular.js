import CommandStructure from '../structures/command';

/**
 * Popular command.
 */
class PopularCommand extends CommandStructure {
    /**
     * Create popular command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Current popular movies on TMDb.',
            usage: false,
            flags: ['page', 'shows'],
            developerOnly: false,
            hideInHelp: false,
            weight: 100
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

        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get results from API.
        const response = flags.shows ? await this.tmdb.getPopularTVShows(flags) :
                                      await this.tmdb.getPopularMovies(flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: `Currently Popular ${flags.shows ? 'TV Shows' : 'Movies'}`,
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].poster_path),

            // Format results.
            fields: response.results.map((result) => flags.shows ? this.resultField(result.name, [
                `First Air Date: ${this.date(result.first_air_date)}`, // Show
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ]) : this.resultField(result.title, [ // Movie
                `Release Date: ${this.date(result.release_date)}`,
                `Vote Average: ${this.check(result.vote_average)}`,
                this.TMDbID(result.id),
            ])),
        });
    }
}

export default PopularCommand;
