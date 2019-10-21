import CommandStructure from '../structures/command';

class PosterCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Get a movie\'s poster.',
            usage: '<Movie Name or ID>',
            flags: ['show', 'person'],
            visible: true,
            developerOnly: false,
            weight: 400
        });
    }

    async executeCommand(message) {
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        const status = await this.searchingMessage(message);

        const flags = this.flags.parse(query, this.meta.flags);
        query = flags.query;

        const poster = flags.show ? await this.tmdb.getTVShowPoster(query, 3) :
            flags.person ? await this.tmdb.getPersonPoster(query, 3) :
            await this.tmdb.getMoviePoster(query, 3);
        if (poster.error) return this.embed.error(status, poster);

        await this.client.createMessage(message.channel.id, '', {
            'file': poster, 'name': 'poster.jpg' });

        status.delete();
    }
}

export default PosterCommand;
