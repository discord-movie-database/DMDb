const Command = require('../handlers/commandHandler');

class SpookyCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'W̸A̵R̴N̸I̴N̷G̷:̷ ̴V̶e̵r̷y̴ ̶s̶c̵a̷r̸y̷ ̴c̸o̶m̶m̸a̷n̵d̸.̷ ̶O̴n̵l̷y̸ ̵f̶o̸r̷ ̷t̵h̶e̵ ̴b̶r̶a̶v̷e̶s̵t̵.̵',
            'longDescription': 'Current most popular movies with the horror genre.',
            'visible': true,
            'restricted': false,
            'weight': 10
        });
    }

    async process(message) {
        // Status of command response
        const status = await this.embed.create(message.channel.id, {
            'title': 'Run while you can. Getting spooky movies...' });

        // Get movies from API
        const movies = await this.api.spooky();
        if (movies.error) return this.embed.error(movies); 

        // Response
        this.embed.edit(status, {
            'title': 'Spooky Movies',
            'description': this.info.longDescription,
            'fields': movies.slice(0, 10).map((movie, index) => { return {
                'name': movie.title,
                'value': `**${(index + 1)}** | Pop: ${this.popularity(movie.popularity)} | \
Release: ${this.releaseDate(movie.release_date)} | \
Vote Average: ${this.voteAverage(movie.vote_average)} | \
*${this.TMDbID(movie.id)}*`
            }})
        })
    }
}

module.exports = SpookyCommand;