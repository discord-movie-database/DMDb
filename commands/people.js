const Command = require('../helpers/command');

class PeopleCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Search for people.',
            'usage': '<Person\'s Name>',
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 550
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
            'description': this.resultDescription(people),

            'fields': people.results.map(person => ({
                'name': person.name,
                'value': this.joinResult([
                    `**${person.index}**`,
                    `Known For: ${this.knownFor(person.known_for)}`,
                    `${this.TMDbID(person.id)}`
                ])
            })),

            'footer': message.db.guild.tips ?
                'TIP: Use flags (--page) to get more and accurate results.' : ''
        });
    }
}

module.exports = PeopleCommand;
