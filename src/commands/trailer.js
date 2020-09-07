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
            aliases: ['video']
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

        // Get videos from API.
        const response = await media.getDetails({ ...options, append_to_response: 'videos' });
        if (response.error) return this.embed.error(statusMessage, _response.error);

        // Check for trailers.
        if (response.videos.results.length === 0)
            return this.embed.error(statusMessage, 'No trailers.');

        // Put videos into pages.
        const videos = this.resultStructure(response.videos.results, flags.page);
        if (videos.error) return this.embed.error(statusMessage, videos.error);

        // Return all videos.
        if (flags.more) return this.embed.edit(statusMessage, {
            title: `Trailers & More for ${response.title || response.name}`,

            thumbnail: {
                url: this.videoThumbnailURL(videos.results[0].site, videos.results[0].key) },
            description: this.resultsDescription(videos),

            fields: videos.results.map((result) => this.fields.renderResult(result.name, [
                this.fields.videoSourceURL(result.site, result.key),
            ], result.index)),
        });

        // Return first video with big preview.
        return this.embed.edit(statusMessage,
            this.fields.videoSourceURL(videos.results[0].site, videos.results[0].key));
    }
}

export default TrailersCommand;
