const Command = require('../handlers/commandHandler');

class PeopleCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Search for people.',
            'longDescription': 'Multiple people with the same name? Search for more than one person. Use the IMDb ID or TMDb ID with the person command to get more detailed information about them.',
            'usage': '<Person\'s Name>',
            'weight': 40,
            'visible': true,
            'restricted': false
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0])
            return this.embed.error(message.channel.id, 'Query required.');

        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Searching...' });

        // Get movies from API
        const people = await this.api.getPeople(message.arguments.join(' '), 1, true);
        if (people.error) return this.embed.error(status, people.error); // Error
        
        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': `Total Results: ${people.total_results} | \
Page: ${people.page}/${people.total_pages}`,
            'fields': people.results.slice(0, 10).map((person, index) => { return {
                'name': person.name,
                'value': `**${(index + 1)}** | \
Known For: ${this.knownFor(person.known_for)} | \
Pop: ${this.popularity(person.popularity)} | \
${this.TMDbID(person.id)}`
            }})
        });
    }
}

module.exports = PeopleCommand;