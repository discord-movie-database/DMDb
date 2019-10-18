import CommandStructure from '../structures/command';

class TrailerCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Get a trailer for a movie.',
            'usage': '<Movie Name or ID>',
            'flags': ['show', 'more'],
            'visible': true,
            'restricted': false,
            'weight': 200
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const flags = this.util.flags(query, this.meta.flags);
        query = flags.query;

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get videos from API
        const videos = flags.show ? await this.api.dmdb.getTVShowVideos(query) :
            await this.api.dmdb.getMovieVideos(query);
        if (videos.error) return this.embed.error(status, videos); // Error

        // All videos
        if (flags.more) return this.embed.edit(status, {
            'fields': videos.results.map(video => ({
                'name': video.name, 'value': this.videoSourceUrl(video.site, video.key)
            }))
        });

        // Filter videos which are not trailers or teasers
        videos.results = videos.results.filter(video =>
            video.type === 'Trailer' || video.type === 'Teaser');

        // Check if there are any videos
        if (videos.results.length === 0)
            return this.embed.error(status, 'No trailers or teasers found.');

        // First result
        const video = videos.results[0];

        // Return link to video
        return this.embed.edit(status, this.videoSourceUrl(video.site, video.key));
    }
}

export default TrailerCommand;
