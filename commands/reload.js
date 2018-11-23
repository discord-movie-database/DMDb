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

        this.embed.success(message.channel.id, 'Reloaded commands, events & handlers.' +
            '\n*Note: Hard restart to update index and new handlers.*');
    }
}

module.exports = ReloadCommand;