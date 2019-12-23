import CommandStructure from '../structures/command';

/**
 * Poster command.
 */
class PosterCommand extends CommandStructure {
    /**
     * Create poster command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the poster for a movie, TV show or person.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['tv', 'person', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 400
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
        const options = this.APIOptions(guildSettings, { year: flags.year });

        // Get response from API.
        const response = await this.tmdb[media].images(message.content, options, true);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Sort posters by highest voted.
        const posters = (response.posters || response.profiles)
            .sort((a, b) => b.vote_count - a.vote_count);
        if (posters.length === 0) return this.embed.error(statusMessage, 'No posters found.');

        // Get best poster.
        const poster = posters[0];

        // Edit status message with poster.
        this.embed.edit(statusMessage, {
            title: `${response.title || response.name}${!flags.person ?
                ` (${this.year(response.release_date || response.first_air_date)})` : ''}`,
            image: { url: this.thumbnailURL(poster.file_path, true) },
        });
    }
}

export default PosterCommand;
