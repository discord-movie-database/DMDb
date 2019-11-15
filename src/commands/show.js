import CommandStructure from '../structures/command';

/**
 * Show command.
 */
class ShowCommand extends CommandStructure {
    /**
     * Create show command.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Get information about a TV show.',
            usage: '<Query or TMDb/IMDb ID>',
            flags: false,
            developerOnly: false,
            hideInHelp: false,
            weight: 500
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

        // Get result from API.
        const response = await this.tmdb.tv.details(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with result.
        this.embed.edit(statusMessage, {
            url: this.TMDbShowURL(response.id),
            title: response.name,
            description: this.description(response.overview),

            thumbnail: this.thumbnailURL(response.poster_path, true),

            // Format response.
            fields: this.fields([{
                name: 'Status',
                value: response.status,
            }, {
                name: 'Type',
                value: this.check(response.type),
            }, {
                name: 'In Production',
                value: this.yesno(response.in_production),
            }, {
                name: 'Episode Runtime',
                value: this.runtime(response.episode_run_time),
            }, {
                name: 'First / Last Air Date',
                value: `${this.date(response.first_air_date)} `
                    + `/ ${this.date(response.last_air_date)}`,
            }, {
                name: 'Season Count',
                value: `${this.check(response.number_of_seasons)} `
                    + `(${this.check(response.number_of_episodes)} episodes)`,
            }, {
                name: 'Genres',
                value: this.list(response.genres.map((g) => g.name)),
            }, {
                name: '-',
                value: '-',
            }, {
                name: 'Tagline',
                value: this.check(response.tagline),
            }, {
                name: 'Created By',
                value: this.list(response.created_by.map((p) => p.name)),
            }, {
                name: 'Networks',
                value: this.list(response.networks.map((n) => n.name)),
            }, {
                name: 'Homepage',
                value: this.check(response.homepage),
            }, {
                name: 'Vote Average',
                value: `**${this.check(response.vote_average)}** `
                    + `(${this.check(response.vote_count)} votes)\n`,
            }, {
                name: 'TMDb ID',
                value: this.TMDbID(response.id),
            }, {
                name: '-',
                value: '-',
            }]),
        });
    }
}

export default ShowCommand;
