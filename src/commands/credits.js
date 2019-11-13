import CommandStructure from '../structures/command';

/**
 * Cast command.
 */
class CastCommand extends CommandStructure {
    /**
     * Create cast command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the cast for a movie.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['page', 'show', 'person'],
            developerOnly: false,
            hideInHelp: false,
            weight: 350
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

        // Get credits from API.
        const response = flags.show   ? await this.tmdb.tv.credits(message.content) :
                         flags.person ? await this.tmdb.person.credits(message.content) :
                                        await this.tmdb.movie.credits(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Put results into correct format.
        const credits = this.resultStructure(response.cast, flags.page);
        if (!credits) return this.embed.error(statusMessage, 'No results.');

        // Edit status message with results.
        this.embed.edit(statusMessage, {
            title: response.title || response.name,
            description: this.resultsDescription(credits),

            thumbnail: this.thumbnailURL(credits.results[0].profile_path
                || credits.results[0].poster_path),

            // Format results.
            fields: credits.results.map((credit) => this.resultField(this.check(credit.character),
                flags.person ? credit.media_type === 'movie' ? [ // Movie
                    this.mediaType(credit.media_type),
                    `Name: ${credit.title}`,
                    `Release: ${this.date(credit.release_date)}`,
                    this.TMDbID(credit.id),
                ] : [ // Show
                    this.mediaType(credit.media_type),
                    `Name: ${credit.name}`,
                    `FAD: ${this.date(credit.first_air_date)}`,
                    this.TMDbID(credit.id),
                ] : [ // Person
                    `Name: ${this.check(credit.name)}`,
                    `Gender: ${this.gender(credit.gender)}`,
                    this.TMDbID(credit.id),
                ], credit.index
            )),

            // Tip option.
            footer: guildSettings.tips ?
                'TIP: Use the flags (--page, --show, --person) to get more results.' : '',
        });
    }
}

export default CastCommand;
