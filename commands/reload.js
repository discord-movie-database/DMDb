const Command = require('../handlers/commandHandler');

class ReloadCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Testing',
            'longDescription': 'Bot developer command only for testing.',
            'visible': false,
            'restricted': true
        });
    }

    async process(message) {
        const reload = this.client.handlers.load.reload();

        if (reload) return this.client.handlers.embed.success(message.channel.id, 'Reloaded.');
        this.client.handlers.embed.error(message.channel.id, 'Reloading.');
    }
}

module.exports = ReloadCommand;