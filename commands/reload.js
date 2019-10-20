import CommandStructure from '../structures/command';

class ReloadCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Developer only command for testing or updating bot.',
            usage: false,
            flags: false,
            visible: false,
            restricted: true,
            weight: 0
        });
    }

    async process(message) {
        await this.client.handlers.load.reload();

        this.embed.success(message.channel.id, 'Reloaded commands, events & handlers.');
    }
}

export default ReloadCommand;
