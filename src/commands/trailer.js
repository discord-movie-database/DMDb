import CommandStructure from '../structures/command';

/**
 * Trailer command.
 */
class TrailerCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get a trailer for a movie.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['show', 'more', 'page'],
            developerOnly: false,
            hideInHelp: false,
            weight: 200
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

        // Get videos from API.
        const response = flags.show ? await this.tmdb.getTVShowVideos(message.content) :
                                      await this.tmdb.getMovieVideos(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Return all videos.
        if (flags.more) {
            // Put videos into pages.
            const videos = this.resultStructure(response.results, flags.page);
            if (!videos) return this.embed.error(statusMessage, 'No videos.');

            // Return videos.
            return this.embed.edit(statusMessage, {
                title: 'All Trailers, Teasers, Bloopers & More!',
                description: this.resultsDescription(videos),

                thumbnail: this.videoThumbnailURL(videos.results[0].site, videos.results[0].key),

                // Format videos.
                fields: videos.results.map((video) => this.resultField(video.name, [
                    this.videoSourceURL(video.site, video.key),
                ], video.index)),
            });
        }

        // Filter only trailers or teasers.
        response.results = response.results.filter((video) =>
            video.type === 'Trailer' || video.type === 'Teaser');

        // Check for trailers.
        if (response.results.length === 0)
            return this.embed.error(statusMessage, 'No trailers found. Try the `--more` flag.');

        // Get first trailer.
        const video = response.results[0];

        // Return trailer.
        return this.embed.edit(statusMessage,
            this.videoSourceURL(video.site, video.key) || 'Video source not supported');
    }
}

export default TrailerCommand;
