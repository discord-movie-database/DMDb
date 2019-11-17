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

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: response.name,
            url: this.TMDbPersonURL(response.id),

            thumbnail: { url: this.thumbnailURL(response.profile_path) },
            description: this.description(response.biography),

            fields: flags.more ? this.fields([{
                name: 'Gender',
                value: this.gender(response.gender),
            }, {
                name: 'Birthday', 
                value: this.date(response.birthday),
            }, {
                name: 'Deathday',
                value: this.date(response.deathday),
            }, {
                name: 'Known For',
                value: this.check(response.known_for_department),
            }, {
                name: 'IMDb ID',
                value: this.check(response.imdb_id),
            }, {
                name: '-',
                value: '-',
            }, {
                name: 'Place of Birth',
                value: this.check(response.place_of_birth),
                inline: false,
            }, {
                name: 'Homepage',
                value: this.check(response.homepage),
                inline: false,
            }]) : this.fields([{
                name: '🎬 — Known For',
                value: this.check(response.known_for_department),
            }, {
                name: '🎉 — Birthday',
                value: this.date(response.birthday),
            }, {
                name: `${response.gender ? response.gender === 2 ? '♂️' : '♀️' : '❓'} — Gender`,
                value: this.gender(response.gender),
            }]),

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.TMDbID(response.id)}` },
        });
    }
}

export default PersonCommand;
