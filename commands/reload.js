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

        if (reload) // Check if successful
            return this.embed.success(message.channel.id, 'Reloaded commands, events & handlers.' +
                '\n*Note: Hard restart to update index and new handlers.*'); // Success
        this.embed.error(message.channel.id, 'Error reloading. Check console.'); // Error
    }
}

module.exports = ReloadCommand;