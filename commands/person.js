import CommandStructure from '../structures/command';

class ActorCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Get information about a person.',
            'usage': '<Person\'s Name or ID>',
            'flags': false,
            'visible': true,
            'restricted': false,
            'weight': 600
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get person from API
        const person = await this.api.dmdb.getPerson(query);
        if (person.error) return this.embed.error(status, person); // Error

        // Response
        this.embed.edit(status, {
            'url': this.tmdbPersonURL(person.id),
            'title': person.name,
            'description': this.description(person.biography),
            'thumbnail': this.thumbnail(person.profile_path),

            'fields': this.parseEmbedFields([
                { 'name': 'Known For', 'value': this.knownForDep(person.known_for_department) },
                { 'name': 'Birthday', 'value': this.birthday(person.birthday) },
                { 'name': 'Deathday', 'value': this.deathday(person.deathday) },
                { 'name': 'Gender', 'value': this.gender(person.gender) },
                { 'name': 'Place of Birth', 'value': this.placeOfBirth(person.place_of_birth) },
                { 'name': 'IMDb ID', 'value': this.IMDbID(person.imdb_id) },
                { 'name': 'TMDb ID', 'value': this.TMDbID(person.id)
            }]),

            'footer': message.db.guild.prefix ? 'TIP: Not the person you wanted?' +
                ` Try searching for them using the ${message.db.guild.prefix}people command.` : ''
        });
    }
}

export default ActorCommand;
