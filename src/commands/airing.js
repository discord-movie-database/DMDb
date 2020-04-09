import CommandStructure from "../structures/command";

/**
 * Airing command. Get a list of TV shows that are airing today.
 */
class AiringCommand extends CommandStructure {
  /**
   * Create airing command.
   *
   * @param {Object} client - DMDb client extends Eris
   */
  constructor(client) {
    super(client, {
      description: "TV shows that are airing today.",
      usage: false,
      flags: ["page"],
      developerOnly: false,
      hideInHelp: false,
      weight: 150,
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
    // Status "Searching..." message.
    const statusMessage = await this.searchingMessage(message);
    if (!statusMessage) return; // No permission to send messages.

    // Check message for flags.
    const flags = this.flags.parse(message.content, this.meta.flags);
    message.content = flags.query; // Remove flags from query.

    // Get API options.
    const options = this.APIOptions(guildSettings, {
      page: flags.page || message.content,
    });

    // Get response from API.
    const response = await this.tmdb.tv.airing(options);
    if (response.error) return this.embed.error(statusMessage, response.error);

    // Edit status message with response data.
    this.embed.edit(statusMessage, {
      title: "TV Shows Airing Today (EST)",
      url: "https://www.themoviedb.org/tv/airing-today",

      thumbnail: { url: this.thumbnailURL(response.results[0].poster_path) },
      description: this.resultsDescription(response),

      fields: response.results.map((result) =>
        this.resultField(
          this.check(result.name),
          [
            `Vote Average: ${this.check(result.vote_average)}`,
            `First Air Date: ${this.date(result.first_air_date)}`,
            this.TMDbID(result.id),
          ],
          result.index
        )
      ),
    });
  }
}

export default AiringCommand;
