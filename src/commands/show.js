import CommandStructure from '../structures/command';

/**
 * Show command. Get the primary information about a TV show.
 */
class ShowCommand extends CommandStructure {
    /**
     * Create show command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get information about a TV show.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['all', 'more', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 500,
            aliases: ['tv','program']
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

        // Set API options.
        const options = this.APIOptions(guildSettings, { year: flags.year });

        // Get response from API.
        const response = await this.tmdb.tv.details(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Prepare fields based on user-defined or default templates
        const fields = this.fields.renderTemplate('show', response, flags, guildSettings);

        // Edit status message with response data.
        this.embed.edit(statusMessage, {
            title: response.name,
            url: this.fields.TMDbShowURL(response.id),

            thumbnail: { url: this.thumbnailURL(response.poster_path) },
            description: this.description(response.overview),
            fields: fields,

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.fields.TMDbID(response.id)}` },
        });
    }
}

export default ShowCommand;
