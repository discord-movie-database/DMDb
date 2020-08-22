import CommandStructure from '../structures/command';

/**
 * Person command. Get the primary information about a person.
 */
class PersonCommand extends CommandStructure {
    /**
     * Create person command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the primary information about a person.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['more'],
            developerOnly: false,
            hideInHelp: false,
            weight: 600
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
        const options = this.APIOptions(guildSettings, {});

        // Get response from API.
        const response = await this.tmdb.person.details(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Prepare fields based on user-defined or default templates
        const fields = this.fields.renderTemplate('person', response, flags.more);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: response.name,
            url: this.fields.TMDbPersonURL(response.id),

            thumbnail: { url: this.thumbnailURL(response.profile_path) },
            description: this.description(response.biography),
            fields: fields,

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.fields.TMDbID(response.id)}` },
        });
    }
}

export default PersonCommand;
