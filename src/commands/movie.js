import CommandStructure from '../structures/command';

/**
 * Movie command. Get the primary information about a movie.
 */
class MovieCommand extends CommandStructure {
    /**
     * Create movie command.
     * 
     * @param {Object} client - DMDb client extends Eris
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
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for arguments.
        if (commandArguments.length === 0) return this.usageMessage(message);

        // Status "Searching..." message.
        const statusMessage = await this.searchingMessage(message);
        if (!statusMessage) return; // No permission to send messages.

        // Check message for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get API options.
        const options = this.APIOptions(guildSettings, {});

        // Get response from API.
        const response = await this.tmdb.movie.details(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response data.
        this.embed.edit(statusMessage, {
            title: response.title,
            url: this.TMDbMovieURL(response.id),

            thumbnail: { url: this.thumbnailURL(response.poster_path) },
            description: this.description(response.overview),

            fields: flags.more ? this.fields([{
                name: 'Tagline',
                value: this.check(response.tagline),
                inline: false,
            }, {
                name: 'Status',
                value: this.check(response.status),
            }, {
                name: 'Release Date',
                value: this.date(response.release_date),
            }, {
                name: 'Runtime',
                value: this.runtime(response.runtime),
            }, {
                name: 'Vote Average',
                value: this.check(response.vote_average),
            }, {
                name: 'Vote Count',
                value: this.number(response.vote_count),
            }, {
                name: 'IMDb ID',
                value: this.check(response.imdb_id),
            }, {
                name: 'Genres',
                value: this.list(response.genres.map((g) => g.name)),
                inline: false,
            }, {
                name: 'Languages',
                value: this.list(response.spoken_languages.map((l) => l.name)),
                inline: false,
            }, {
                name: 'Production Countries',
                value: this.list(response.production_countries.map((c) => c.name)),
                inline: false,
            }, {
                name: 'Production Companies',
                value: this.list(response.production_companies.map((c) => c.name)),
                inline: false,
            }, {
                name: 'Homepage',
                value: this.check(response.homepage),
                inline: false,
            }, {
                name: 'Budget',
                value: this.money(response.budget),
            }, {
                name: 'Revenue',
                value: this.money(response.revenue),
            }, {
                name: '-',
                value: '-',
            }]) : this.fields([response.tagline ? {
                name: '💬 — Tagline',
                value: this.check(response.tagline),
                inline: false,
            } : { // Show genres instead of tagline if there isn't one.
                name: '👽 — Genres',
                value: this.list(response.genres.map((g) => g.name)),
                inline: false,
            }, response.vote_average ? {
                name: '⭐ — Vote Average',
                value: `**${this.check(response.vote_average)}** `
                    + `(${this.number(response.vote_count)} votes)`,
            } : { // Show status instead of votes if there are none.
                name: '🗞️ — Status',
                value: this.check(response.status),
            }, {
                name: '📆 — Release Date',
                value: this.date(response.release_date),
            }, response.status === 'Released' ? {
                name: '🎞️ — Runtime',
                value: this.runtime(response.runtime),
            } : { // Show language instead of runtime if not released yet.
                name: '🗣️ — Language',
                value: this.list(response.spoken_languages.slice(0, 1).map((l) => l.name)),
            }]),

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.TMDbID(response.id)}` },
        });
    }
}

export default MovieCommand;
