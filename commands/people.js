import CommandStructure from '../structures/command';

class PeopleCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Search for people.',
            usage: '<Person\'s Name>',
            flags: ['page'],
            visible: true,
            restricted: false,
            weight: 550
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(mesage);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const people = await this.tmdb.getPeople(flags);
        if (people.error) return this.embed.error(status, people.error);
        
        this.embed.edit(status, {
            title: 'Search Results',
            description: this.resultDescription(people),

            fields: people.results.map(person => ({
                name: person.name,
                value: this.joinResult([
                    `**${person.index}**`,
                    `Known For: ${this.knownFor(person.known_for)}`,
                    `${this.TMDbID(person.id)}`
                ])
            })),

            footer: message.db.guild.tips ?
                'TIP: Use flags (--page) to get more and accurate results.' : ''
        });
    }
}

export default PeopleCommand;
