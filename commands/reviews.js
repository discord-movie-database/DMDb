const Command = require('../handlers/commandHandler');

class ReviewsCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Get the user reviews for a movie.',
            'documentation': true,
            'usage': '<Movie Name or ID>',
            'weight': 33,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        // Get movies from API
        const reviews = await this.api.dmdb.getMovieReviews(flags);
        if (reviews.error) return this.embed.error(status, reviews.error); // Error

        // Response
        this.embed.edit(status, {
            'title': `${reviews.title} - Reviews`,
            'description': `Current Page: **${reviews.page}** **|**` +
                ` Total Pages: ${reviews.total_pages} **|**` + 
                ` Total Results: ${reviews.total_results}`,
            
            'fields': reviews.results.map(review => ({
                'name': review.author,
                'value': `**${review.index}** **|** ${this.review(review.content)}\n` +
                    `[Click here to read the full review.](${review.url})`
            })),

            'footer': message.db.guild.tips ?
                'TIP: Use flags (--page) to get more results.' : ''
        });
    }
}

module.exports = ReviewsCommand;