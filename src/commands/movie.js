import CommandStructure from '../structures/command';

/**
 * Movie command. Get the primary information about a movie.
 */
class MovieCommand extends CommandStructure {
    /**
     * Create movie command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the primary information about a movie.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['more', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 700,
            aliases: ['film']
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

        // Check message for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get API options.
        const options = this.APIOptions(guildSettings, { year: flags.year });

        // Get response from API.
        const response = await this.tmdb.movie.details(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Prepare fields based on user-defined or default templates
        const fields = this.fields.renderTemplate('movie', response, flags.more, guildSettings);

        // Edit status message with response data.
        this.embed.edit(statusMessage, {
            title: response.title,
            url: this.fields.TMDbMovieURL(response.id),

            thumbnail: { url: this.thumbnailURL(response.poster_path) },
            description: this.description(response.overview),
            fields: fields,

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.fields.TMDbID(response.id)}` },
        });
    }
}

export default MovieCommand;
