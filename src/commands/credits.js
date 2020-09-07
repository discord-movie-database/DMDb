import CommandStructure from '../structures/command';

/**
 * Credits command. Get cast.
 */
class CreditsCommand extends CommandStructure {
    /**
     * Create credits command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the cast for a movie, TV show or person.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['page', 'tv', 'person', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 350,
            aliases: ['cast']
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
        const options = this.APIOptions(guildSettings, { page: flags.page, year: flags.year });

        // Get media from API.
        const media = await this.getMedia(flags)({
            externalId: message.content, query: message.content });

        // Get response from API.
        const response = await media.getDetails({ ...options, append_to_response: 'credits' });
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Put response results into correct format.
        const credits = this.resultStructure(response.credits.cast, flags.page);
        if (credits.error) return this.embed.error(statusMessage, credits.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            title: `${response.title || response.name} Credits`,
            url: response.id ? this.fields.TMDbShowURL(response.id) : '',

            thumbnail: { url: this.thumbnailURL(credits.results[0].profile_path
                || credits.results[0].poster_path) },
            description: this.resultsDescription(credits),

            fields: credits.results.map((credit) => this.fields.renderResult(this.fields.check(credit.character),
                flags.person ? credit.media_type === 'movie' ? [
                    // Media source is person and credit is movie
                    this.flags.mediaType(credit.media_type),
                    `Name: ${credit.title}`,
                    `Release: ${this.fields.date(credit.release_date)}`,
                    this.fields.TMDbID(credit.id),
                ] : [
                    // Media source is person and credit is TV show
                    this.flags.mediaType(credit.media_type),
                    `Name: ${credit.name}`,
                    `FAD: ${this.fields.date(credit.first_air_date)}`,
                    this.fields.TMDbID(credit.id),
                ] : [
                    // Media source is TV show or person
                    `Name: ${this.fields.check(credit.name)}`,
                    `Gender: ${this.fields.gender(credit.gender)}`,
                    this.fields.TMDbID(credit.id),
                ], credit.index
            )),
        });
    }
}

export default CreditsCommand;
