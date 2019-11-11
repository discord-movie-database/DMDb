import CommandStructure from '../structures/command';

/**
 * Person command. Get the primary information about a person.
 */
class PersonCommand extends CommandStructure {
    /**
     * Create person command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get information about a person.',
            usage: '<Person\'s Name or ID>',
            flags: false,
            developerOnly: false,
            hideInHelp: false,
            weight: 600
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

        // Get response from API.
        const response = await this.tmdb.getPerson(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            url: this.TMDbPersonURL(response.id),
            title: response.name,
            description: this.description(response.biography),

            thumbnail: this.thumbnailURL(response.profile_path, true),

            // Format response.
            fields: this.fields([
                { name: 'Known For', value: this.check(response.known_for_department) },
                { name: 'Birthday', value: this.year(response.birthday) },
                { name: 'Deathday', value: this.year(response.deathday) },
                { name: 'Gender', value: this.gender(response.gender) },
                { name: 'Place of Birth', value: this.check(response.place_of_birth) },
                { name: 'Homepage', value: this.check(response.homepage) },
                { name: 'IMDb ID', value: this.check(response.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(response.id)
            }]),

            // Tip option.
            footer: guildSettings.tips ? 'TIP: Not the person you wanted?' +
                ` Try searching for them using the people command.` : ''
        });
    }
}

export default PersonCommand;
