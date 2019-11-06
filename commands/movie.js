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
            usage: '<Movie Name or ID>',
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
        const response = await this.tmdb.getMovie(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            url: this.TMDbMovieURL(response.id),
            title: response.title,
            description: this.description(response.overview),

            thumbnail: this.thumbnailURL(response.poster_path, true),

            // Format response.
            fields: this.fields(flags.more ? [
                { name: 'Status', value: response.status },
                { name: 'Release Date', value: this.date(response.release_date) },
                { name: 'Runtime', value: this.runtime(response.runtime) },
                { name: 'Popularity', value: this.popularity(response.popularity) },
                { name: 'Genres', value:
                    this.list(response.genres.map((genre) => genre.name)), inline: false },
                { name: 'Countries', value: this.list(response.production_countries.map((country) =>
                    country.name)), inline: false },
                { name: 'Languages', value: this.list(response.spoken_languages.map((language) => 
                    language.name)), inline: false },
                { name: 'Budget', value: this.money(response.budget) },
                { name: 'Revenue', value: this.money(response.revenue) },
                { name: 'Homepage', value: this.check(response.homepage), inline: false },
                { name: 'Vote Average', value: this.check(response.vote_average) },
                { name: 'Votes', value: this.check(response.vote_count) },
                { name: 'IMDb ID', value: this.check(response.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(response.id)
            }] : [
                { name: 'Release Date', value: this.date(response.release_date) },
                { name: 'Runtime', value: this.runtime(response.runtime) },
                { name: 'Revenue', value: this.money(response.revenue) },
                { name: 'Vote Average', value: this.check(response.vote_average) },
                { name: 'IMDb ID', value: this.check(response.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(response.id) }
            ]),

            // Tip option.
            footer: guildSettings.tips ?
                'TIP: Want more information for this result? Use the (--more) flag.' : ''
        });
    }
}

export default MovieCommand;
