import CommandStructure from '../structures/command';

/**
 * Movie command. Get the primary information about a movie.
 */
class MovieCommand extends CommandStructure {
    /**
     * Create movie command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get the primary information about a movie.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['more'],
            developerOnly: false,
            hideInHelp: false,
            weight: 700
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

        // Get response from API.
        const resp = await this.tmdb.movie.details(message.content, this.options(guildSettings));
        if (resp.error) return this.embed.error(statusMessage, resp.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            url: this.TMDbMovieURL(resp.id),
            title: resp.title,
            description: this.description(resp.overview),

            thumbnail: this.thumbnailURL(resp.poster_path, true),

            // Format resp.
            fields: this.fields(flags.more ? [
                { name: 'Status', value: resp.status },
                { name: 'Release Date', value: this.date(resp.release_date) },
                { name: 'Runtime', value: this.runtime(resp.runtime) },
                { name: 'Popularity', value: this.popularity(resp.popularity) },
                { name: 'Genres', value:
                    this.list(resp.genres.map((genre) => genre.name)), inline: false },
                { name: 'Countries', value: this.list(resp.production_countries.map((country) =>
                    country.name)), inline: false },
                { name: 'Languages', value: this.list(resp.spoken_languages.map((language) => 
                    language.name)), inline: false },
                { name: 'Budget', value: this.money(resp.budget) },
                { name: 'Revenue', value: this.money(resp.revenue) },
                { name: 'Tagline', value: this.check(resp.tagline), inline: false },
                { name: 'Homepage', value: this.check(resp.homepage), inline: false },
                { name: 'Vote Average', value: this.check(resp.vote_average) },
                { name: 'Votes', value: this.check(resp.vote_count) },
                { name: 'IMDb ID', value: this.check(resp.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(resp.id)
            }] : [
                { name: 'Release Date', value: this.date(resp.release_date) },
                { name: 'Runtime', value: this.runtime(resp.runtime) },
                { name: 'Revenue', value: this.money(resp.revenue) },
                { name: 'Vote Average', value: this.check(resp.vote_average) },
                { name: 'IMDb ID', value: this.check(resp.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(resp.id) }
            ]),

            // Tip option.
            footer: guildSettings.tips ?
                'TIP: Want more information for this result? Use the (--more) flag.' : ''
        });
    }
}

export default MovieCommand;
