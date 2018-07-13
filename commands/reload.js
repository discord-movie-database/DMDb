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
        // Reload.
        const reload = this.client.handlers.load.reload();

        // Check if successful.
        if (reload) // Success.
            return this.client.handlers.embed.success(message.channel.id, 'Reloaded.');
        this.client.handlers.embed.error(message.channel.id, 'Reloading.'); // Error.
    }
}

module.exports = ReloadCommand;