import CommandStructure from '../structures/command';

class EvalCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            'description': 'Developer only command for testing.',
            'usage': '<Javascript>',
            'flags': false,
            'visible': false,
            'restricted': true,
            'weight': 0
        });
    }

    async process(message) {
        // Check for arguments
        if (!message.arguments[0]) return this.usageMessage(message);

        let evaluated;
        try { // Evaluate
            evaluated = eval(message.arguments.join(' '));
        } catch (err) { evaluated = err; }

        // Response
        const response = typeof evaled === 'object' ? JSON.stringify(evaluated) :
            [undefined, null].indexOf(evaluated) >= 0 ? 'No Content' : `${evaluated}`;
        this.embed.success(message.channel.id, `${response}` || 'Unhandled response.');
    }
}

export default EvalCommand;
