const Command = require('../handlers/commandHandler');

class ReloadCommand extends Command {
    constructor(client) {
        super(client, {
            'visible': false,
            'restricted': true
        });
    }

    async process(message) {
        const reload = await this.client.handlers.load.reload();

        this.embed.success(message.channel.id, 'Reloaded commands, events & handlers.');
    }
}

module.exports = ReloadCommand;