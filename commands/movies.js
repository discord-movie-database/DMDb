import CommandStructure from '../structures/command';

class MoviesCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Search for movies.',
            usage: '<Movie Name>',
            flags: ['page', 'year'],
            visible: true,
            restricted: false,
            weight: 650
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const movies = await this.tmdb.getMovies(flags);
        if (movies.error) return this.embed.error(status, movies.error);

        movies.year = flags.year && /^\d{4}$/.test(flags.year) ? flags.year : 'All';;

        this.embed.edit(status, {
            title: 'Search Results',
            description: this.resultDescription(movies),
            
            fields: movies.results.map(movie => ({
                name: movie.title,
                value: this.joinResult([
                    `**${movie.index}**`,
                    `Vote Average: ${this.voteAverage(movie.vote_average)}`,
                    `Release: ${this.releaseDate(movie.release_date)}`,
                    `${this.TMDbID(movie.id)}`
                ])
            })),

            footer: message.db.guild.tips ?
                'TIP: Use flags (--year, --page) to get more results.' : ''
        });
    }
}

export default MoviesCommand;
