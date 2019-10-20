import CommandStructure from '../structures/command';

class EvalCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'Developer only command for testing.',
            usage: '<expression>',
            flags: false,
            visible: false,
            restricted: true,
            weight: 0
        });
    }

    async process(message) {
        if (!message.arguments[0]) return this.usageMessage(message);

        let evaluated;
        try {
            evaluated = eval(message.arguments.join(' '));
        } catch (err) { evaluated = err; }

        const response = typeof evaled === 'object' ? JSON.stringify(evaluated) :
            [undefined, null].indexOf(evaluated) >= 0 ? 'No Content' : `${evaluated}`;
        this.embed.success(message.channel.id, `${response}` || 'Unhandled response.');
    }
}

export default EvalCommand;
