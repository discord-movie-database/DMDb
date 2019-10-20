import CommandStructure from '../structures/command';

class TrailerCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get a trailer for a movie.',
            usage: '<Movie Name or ID>',
            flags: ['show', 'more'],
            visible: true,
            restricted: false,
            weight: 200
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const status = await this.searchingMessage(message);

        const videos = flags.show ? await this.tmdb.getTVShowVideos(query) :
            await this.tmdb.getMovieVideos(query);
        if (videos.error) return this.embed.error(status, videos);

        if (flags.more) return this.embed.edit(status, {
            fields: videos.results.map(video => ({
                name: video.name, value: this.videoSourceUrl(video.site, video.key)
            }))
        });

        videos.results = videos.results.filter(video =>
            video.type === 'Trailer' || video.type === 'Teaser');

        if (videos.results.length === 0)
            return this.embed.error(status, 'No trailers or teasers found.');

        const video = videos.results[0];

        return this.embed.edit(status, this.videoSourceUrl(video.site, video.key));
    }
}

export default TrailerCommand;
