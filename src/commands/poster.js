import CommandStructure from '../structures/command';

/**
 * Poster command.
 */
class PosterCommand extends CommandStructure {
    /**
     * Create poster command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get a movie\'s poster.',
            usage: '<Movie Name or ID>',
            flags: ['show', 'person'],
            developerOnly: false,
            hideInHelp: false,
            weight: 400
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
        const response = flags.show   ? await this.tmdb.getTVShowPoster(message.content, 3) :
                         flags.person ? await this.tmdb.getPersonPoster(message.content, 3) :
                                        await this.tmdb.getMoviePoster(message.content, 3);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with poster.
        this.embed.edit(statusMessage, { image: response });
    }
}

export default PosterCommand;
