const Command = require('../handlers/commandHandler');

class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Testing',
            'longDescription': 'Bot developer command only for testing.',
            'visible': false,
            'restricted': true
        });
    }

    async process(message) {
        // Check for arguments.
        if (!message.arguments[0])
            return this.client.handlers.embed.error(message.channel.id, 'No Arguments.');

        // Response content.
        let evaled;

        // Try eval.
        try {
            evaled = eval(message.arguments.join(' '));
        } catch (err) {
            evaled = err;
        }

        // Response.
        this.client.handlers.embed.success(message.channel.id, evaled || 'Done.');
    }
}

module.exports = EvalCommand;