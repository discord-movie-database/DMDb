import CommandStructure from '../structures/command';

/**
 * Show command. Get the primary information about a TV show.
 */
class ShowCommand extends CommandStructure {
    /**
     * Create show command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get information about a TV show.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: ['more', 'year'],
            developerOnly: false,
            hideInHelp: false,
            weight: 500
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

        // Check message for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Set API options.
        const options = this.APIOptions(guildSettings, { year: flags.year });

        // Get response from API.
        const response = await this.tmdb.tv.details(message.content, options);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with response data.
        this.embed.edit(statusMessage, {
            title: response.name,
            url: this.TMDbShowURL(response.id),

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
                name: 'Type',
                value: this.check(response.type),
            }, {
                name: 'In Production',
                value: this.yesno(response.in_production),
            }, {
                name: 'First Air Date',
                value: this.date(response.first_air_date),
            }, {
                name: 'Last Air Date',
                value: this.date(response.last_air_date),
            }, {
                name: 'Episode Runtime',
                value: this.runtime(response.episode_run_time),
            }, {
                name: 'Last Episode to Air',
                value: this.date(response.last_episode_to_air
                    ? response.last_episode_to_air.air_date : false),
            }, {
                name: 'Next Episode to Air',
                value: this.date(response.next_episode_to_air
                    ? response.next_episode_to_air.air_date : false),
            }, {
                name: 'Number of Seasons',
                value: `${this.check(response.number_of_seasons)} `
                    + `(${this.check(response.number_of_episodes)} episodes)`,
            }, {
                name: 'Vote Average',
                value: this.check(response.vote_average),
            }, {
                name: 'Vote Count',
                value: this.number(response.vote_count),
            }, {
                name: '-',
                value: '-',
            }, {
                name: `Production Compan${this.plural(response.production_companies, true)}`,
                value: this.list(response.production_companies.map((l) => l.name)),
                inline: false,
            }, {
                name: `Network${this.plural(response.networks)}`,
                value: this.list(response.networks.map((n) => n.name)),
                inline: false,
            }, {
                name: 'Homepage',
                value: this.check(response.homepage),
                inline: false,
            }]) : this.fields([response.tagline ? {
                name: '💬 — Tagline',
                value: this.check(response.tagline),
                inline: false,
            } : { // Show genres instead of tagline if there isn't one.
                name: `👽 — Genre${this.plural(response.genres)}`,
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
                name: '📆 — First Air Date',
                value: this.date(response.first_air_date),
            }, {
                name: '🎞️ — Episode Runtime',
                value: this.runtime(response.episode_run_time),
            }]),

            timestamp: new Date().toISOString(),

            footer: { text: `TMDb ID: ${this.TMDbID(response.id)}` },
        });
    }
}

export default ShowCommand;
