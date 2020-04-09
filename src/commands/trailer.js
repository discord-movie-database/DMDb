import CommandStructure from '../structures/command';

/**
 * Trailer command.
 */
class TrailersCommand extends CommandStructure {
    /**
     * Create trailer command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get trailers for movies and TV shows.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['more', 'page', 'tv', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 200,
            aliases:['video']
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
        const options = this.APIOptions(guildSettings, { page: flags.page, year: flags.year });

        // Get videos from API.
        const _response = await this.tmdb[media].videos(message.content, options, true);
        if (_response.error) return this.embed.error(statusMessage, _response.error);

        // Check for trailers.
        if (_response.results.length === 0) return this.embed.error(statusMessage, 'No trailers.');

        // Put videos into pages.
        const response = this.resultStructure(_response.results, flags.page);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Return all videos.
        if (flags.more) return this.embed.edit(statusMessage, {
            title: `Trailers & More for ${_response.title || _response.name}`,

            thumbnail: {
                url: this.videoThumbnailURL(response.results[0].site, response.results[0].key) },
            description: this.resultsDescription(response),

            fields: response.results.map((result) => this.resultField(result.name, [
                this.videoSourceURL(result.site, result.key),
            ], result.index)),
        });

        // Return first video with big preview.
        return this.embed.edit(statusMessage,
            this.videoSourceURL(response.results[0].site, response.results[0].key));
    }
}

export default TrailersCommand;
