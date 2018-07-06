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
        if (!message.arguments[0])
            return this.client.handlers.embed.error(message.channel.id, 'No Arguments.');

        const argumentsJoin = message.arguments.join(' ');
        let evaled;

        try {
            evaled = eval(argumentsJoin);
        } catch (err) {
            evaled = err;
        }

        this.client.handlers.embed.success(message.channel.id, evaled || 'Done.');
    }
}

module.exports = EvalCommand;