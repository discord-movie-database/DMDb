import CommandStructure from '../structures/command';

class PersonCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get information about a person.',
            usage: '<Person\'s Name or ID>',
            flags: false,
            visible: true,
            developerOnly: false,
            weight: 600
        });
    }

    async executeCommand(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        const query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const person = await this.tmdb.getPerson(query);
        if (person.error) return this.embed.error(status, person);

        this.embed.edit(status, {
            url: this.tmdbPersonURL(person.id),
            title: person.name,
            description: this.description(person.biography),
            thumbnail: this.thumbnail(person.profile_path),

            fields: this.parseEmbedFields([
                { name: 'Known For', value: this.knownForDep(person.known_for_department) },
                { name: 'Birthday', value: this.birthday(person.birthday) },
                { name: 'Deathday', value: this.deathday(person.deathday) },
                { name: 'Gender', value: this.gender(person.gender) },
                { name: 'Place of Birth', value: this.placeOfBirth(person.place_of_birth) },
                { name: 'IMDb ID', value: this.IMDbID(person.imdb_id) },
                { name: 'TMDb ID', value: this.TMDbID(person.id)
            }]),

            footer: message.db.guild.prefix ? 'TIP: Not the person you wanted?' +
                ` Try searching for them using the ${message.db.guild.prefix}people command.` : ''
        });
    }
}

export default PersonCommand;
