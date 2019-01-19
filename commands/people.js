const Command = require('../handlers/commandHandler');

class PeopleCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for people.',
            'longDescription': 'Multiple people with the same name? Search for more than one person.' +
                'Use the **IMDb ID** or **TMDb ID** with the `person` command to get more detailed information about them.\n\n' +
                'Use **flags** to get even more and accurate results.\nAvailable flags for this command: `page`.\n\n' +
                'Examples:\n`prefix#people Christoph Waltz --page 2`',
            'usage': '<Person\'s Name>',
            'weight': 40,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(mesage);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        // Get movies from API
        const people = await this.api.dmdb.getPeople(flags);
        if (people.error) return this.embed.error(status, people.error); // Error
        
        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Current Page: **${people.page}** **|** `+
                `Total Pages: ${people.total_pages} **|** ` +
                `Total Results: ${people.total_results}`,

            'fields': people.results.map(person => ({
                'name': person.name,
                'value': `**${person.index}** **|** ` +
                    `Known For: ${this.knownFor(person.known_for)} **|** ` +
                    `${this.TMDbID(person.id)}`
            })),

            'footer': 'TIP: Use flags (--page) to get more and accurate results.'
        });
    }
}

module.exports = PeopleCommand;