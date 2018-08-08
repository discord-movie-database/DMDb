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
        // Reload
        const reload = this.client.handlers.load.reload();

        // Check if successful
        if (reload) // Success
            return this.embed.success(message.channel.id, 'Reloaded.');
        this.embed.error(message.channel.id, 'Reloading.'); // Error
    }
}

module.exports = ReloadCommand;