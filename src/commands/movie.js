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
            flags: false,
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

        // Get response from API.
        const response = await this.tmdb.movie.details(message.content, this.options(guildSettings));
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response.
        this.embed.edit(statusMessage, {
            url: this.TMDbMovieURL(response.id),
            title: response.title,
            description: this.description(response.overview),

            thumbnail: this.thumbnailURL(response.poster_path, true),

            // Format response.
            fields: this.fields([{
                name: 'Status',
                value: response.status,
            }, {
                name: 'Release Date',
                value: this.date(response.release_date),
            }, { 
                name: 'Runtime',
                value: this.runtime(response.runtime),
            }, {
                name: 'Genres',
                value: this.list(response.genres.map((g) => g.name)),
            }, {
                name: 'Budget / Revenue',
                value: `${this.money(response.budget)} / ${this.money(response.revenue)}`,
            }, {
                name: 'Tagline',
                value: this.check(response.tagline),
            }, {
                name: 'Countries',
                value: this.list(response.production_countries.map((c) => c.name)),
            }, {
                name: 'Languages',
                value: this.list(response.spoken_languages.map((l) => l.name)),
            }, {
                name: 'Homepage',
                value: this.check(response.homepage),
            }, {
                name: 'Vote Average',
                value: `**${this.check(response.vote_average)}** `
                    + `(${this.check(response.vote_count)} votes)`,
            }, {
                name: 'IMDb ID',
                value: this.check(response.imdb_id),
            }, {
                name: 'TMDb ID',
                value: this.TMDbID(response.id),
            }]),
        });
    }
}

export default MovieCommand;
