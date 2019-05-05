const Command = require('../helpers/command');

class ShowHandler extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get information about a TV show.',
            'documentation': true,
            'usage': '<TV Show Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 37
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get TV show from API
        const TVShow = await this.api.dmdb.getTVShow(query);
        if (TVShow.error) return this.embed.error(status, TVShow.error); // Error

        // Response
        this.embed.edit(status, {
            'url': this.tmdbShowURL(TVShow.id),
            'title': TVShow.name,
            'description': this.description(TVShow.overview),
            'thumbnail': this.thumbnail(TVShow.poster_path),

            'fields': this.parseEmbedFields([
                { 'name': 'Status', 'value': TVShow.status },
                { 'name': 'Type', 'value': this.type(TVShow.type) },
                { 'name': 'Episode Runtime', 'value': this.epRuntime(TVShow.episode_run_time) },
                { 'name': 'In Production', 'value': this.yesno(TVShow.in_production) },
                { 'name': 'First Air Date', 'value': this.releaseDate(TVShow.first_air_date) },
                { 'name': 'Last Air Date', 'value': this.releaseDate(TVShow.last_air_date) },
                { 'name': 'Genres', 'value': this.genres(TVShow.genres), 'inline': false },
                { 'name': 'Created By', 'value': this.createdBy(TVShow.created_by) },
                { 'name': 'Networks', 'value': this.networks(TVShow.networks) },
                { 'name': 'Homepage', 'value': this.homepage(TVShow.homepage), 'inline': false },
                { 'name': 'Vote Average', 'value': this.voteAverage(TVShow.vote_average) },
                { 'name': 'Votes', 'value': this.voteCount(TVShow.vote_count) },
                { 'name': 'Season Count', 'value':
                    `${this.seasonCount(TVShow.seasons)} (${this.episodeCount(TVShow.seasons)} Episodes)` },
                { 'name': 'TMDb ID', 'value': this.TMDbID(TVShow.id)
            }]),

            'footer': message.db.guild.tips ? `TIP: Not the TV show you wanted? ` +
                `Try searching for it using the ${message.db.guild.prefix}shows command.` : ''
        });
    }
}

module.exports = ShowHandler;
