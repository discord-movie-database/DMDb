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
            flags: ['more'],
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

        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);
        message.content = flags.query; // Remove flags from query.

        // Get result from API.
        const response = await this.tmdb.getTVShow(message.content);
        if (response.error) return this.embed.error(statusMessage, response.error);

        // Edit status message with result.
        this.embed.edit(statusMessage, {
            url: this.TMDbShowURL(response.id),
            title: response.name,
            description: this.description(response.overview),

            thumbnail: this.thumbnailURL(response.poster_path, true),

            // Format result.
            fields: this.fields(flags.more ? [
                { name: 'Status', value: response.status },
                { name: 'Type', value: this.check(response.type) },
                { name: 'Episode Runtime', value: this.runtime(response.episode_run_time) },
                { name: 'In Production', value: this.yesno(response.in_production) },
                { name: 'First Air Date', value: this.date(response.first_air_date) },
                { name: 'Last Air Date', value: this.date(response.last_air_date) },
                { name: 'Genres', value:
                    this.list(response.genres.map((genre) => genre.name)), inline: false },
                { name: 'Created By', value:
                    this.list(response.created_by.map((person) => person.name)) },
                { name: 'Networks',
                    value: this.list(response.networks.map((network) => network.name)) },
                { name: 'Tagline', value: this.check(response.tagline), inline: false },
                { name: 'Homepage', value: this.check(response.homepage), inline: false },
                { name: 'Vote Average', value: this.check(response.vote_average) },
                { name: 'Votes', value: this.check(response.vote_count) },
                { name: 'Season Count', value:
                    `${this.size(response.seasons)} (${this.size(response.seasons)} Episodes)` },
                { name: 'TMDb ID', value: this.TMDbID(response.id) },
            ] : [
                { name: 'Episode Runtime', value: this.runtime(response.episode_run_time) },
                { name: 'In Production', value: this.yesno(response.in_production) },
                { name: 'First Air Date', value: this.date(response.first_air_date) },
                { name: 'Last Air Date', value: this.date(response.last_air_date) },
                { name: 'Vote Average', value: this.check(response.vote_average) },
                { name: 'Votes', value: this.check(response.vote_count) },
                { name: 'Season Count', value:
                    `${this.size(response.seasons)} (${this.size(response.seasons)} Episodes)` },
                { name: 'TMDb ID', value: this.TMDbID(response.id) },
            ]),

            // Tip option.
            footer: guildSettings.tips ? `TIP: Not the TV show you wanted? ` +
                `Try searching for it using the shows command.` : ''
        });
    }
}

export default ShowCommand;
