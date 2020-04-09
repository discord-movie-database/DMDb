import CommandStructure from "../structures/command";

/**
 * People command. Search for people.
 */
class PeopleCommand extends CommandStructure {
    /**
     * Create people command.
     *
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: "Search for people.",
            usage: "<Query>",
            flags: ["page"],
            developerOnly: false,
            hideInHelp: false,
            weight: 550,
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

        // Get API options.
        const options = this.APIOptions(guildSettings, { page: flags.page });

        // Get response from API.
        const response = await this.tmdb.search.person(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: "Search Results",

            thumbnail: { url: this.thumbnailURL(response.results[0].profile_path) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) =>
                this.resultField(
                    result.name,
                    [
                        `Known For: ${this.list(
                            result.known_for
                                .slice(0, 2)
                                .map((known) =>
                                    known.media_type === "movie" ? known.title : known.name
                                )
                        )}`,
                        this.TMDbID(result.id),
                    ],
                    result.index
                )
            ),
        });
    }
}

export default PeopleCommand;
