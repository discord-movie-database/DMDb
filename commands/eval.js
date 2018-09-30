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
        // Check for arguments
        if (!message.arguments[0])
            return this.embed.error(message.channel.id, 'No Arguments.');

        // Eval content
        let evaled;
        // Eval
        try { evaled = eval(message.arguments.join(' ')); }
        catch (err) { evaled = err; }

        // Response
        const response = typeof evaled === 'object' ? JSON.stringify(evaled) :
                         typeof evaled === 'undefined' ? 'No Content' : `${evaled}`;
        this.embed.success(message.channel.id, response || 'Done.');
    }
}

module.exports = EvalCommand;