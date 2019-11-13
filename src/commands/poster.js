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
            usage: '<Query or TMDb/IMDb ID>',
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
        const resp = flags.show   ? await this.tmdb.tv.images(message.content, this.options(guildSettings)) :
                     flags.person ? await this.tmdb.person.images(message.content, this.options(guildSettings)) :
                                    await this.tmdb.movie.images(message.content, this.options(guildSettings));
        if (resp.error) return this.embed.error(statusMessage, resp.error);

        // Sort posters by highest voted.
        const posters = resp.posters.sort((a, b) => b.vote_count - a.vote_count);
        if (posters.length === 0) return this.embed.error(statusMessage, 'No posters found.');

        // Get best poster.
        const poster = posters[0];

        // Edit status message with poster.
        this.embed.edit(statusMessage, { image: this.imageURL(poster.file_path) });
    }
}

export default PosterCommand;
