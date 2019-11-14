import CommandStructure from '../structures/command';

/**
 * People command. Search for people.
 */
class PeopleCommand extends CommandStructure {
    /**
     * Create people command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Search for people.',
            usage: '<Query>',
            flags: ['page'],
            developerOnly: false,
            hideInHelp: false,
            weight: 550
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
        const response = await this.tmdb.search.person(message.content, flags);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: 'Search Results',
            description: this.resultsDescription(response),

            thumbnail: this.thumbnailURL(response.results[0].profile_path, true),

            // Format results.
            fields: response.results.map((result) => this.resultField(result.name, [
                `Known For: ${this.list(result.known_for.slice(0, 2).map((known) => 
                    known.media_type === 'movie' ? known.title : known.name))}`,
                this.TMDbID(result.id)
            ], result.index)),

            // Tip option.
            footer: guildSettings.tips ? 'TIP: Use flags (--page) to get more results.' : ''
        });
    }
}

export default PeopleCommand;
