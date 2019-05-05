const Command = require('../helpers/command');

class ReloadCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Developer only command for testing or updating bot.',
            'usage': null,
            'documentation': false,
            'visible': false,
            'restricted': true,
            'weight': 0
        });
    }

    async process(message) {
        // Wait for reload process
        await this.client.handlers.load.reload();

        // Finished reloading
        this.embed.success(message.channel.id, 'Reloaded commands, events & handlers.');
    }
}

module.exports = ReloadCommand;
