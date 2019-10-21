import CommandStructure from '../structures/command';

class FlagsCommand extends CommandStructure {
    constructor(client) {
        super(client, {
            description: 'What flags do and how to use them.',
            usage: false,
            flags: ['more'],
            visible: false,
            developerOnly: false,
            weight: 0
        });

        this.flagOptions = this.client.util.getUtil('flags').flags;
    }

    async executeCommand(message) {
        const query = message.arguments.join(' ');

        const flags = this.flags.parse(query, this.meta.flags);

        this.embed.create(message.channel.id, {
            title: 'Flags',
            description: 'Flags gives you access to more options for more specific results. ' +
                'A flag start with `--` followed by the flag name and somtimes an argument after. The argument is anything ' +
                'after the flag name seperated by a space and ending by a space or nothing if it\'s the end of the command. ' +
                'You can place the flag anywhere in the query and use multiple flags if the flag hasn\'t already been used.' +
                
                (flags.more ? '\n\nList of possible flags:' : '\n\nHere are some examples:\n' +
                '`!?poster Black Mirror --show`\n`!?poster George --person Clooney`\n' +
                '`!?movies Thor --page 2 --year 2017`\n`!?credits --person George Clooney`' +
                '\n\nUse the `--more` flag with this command to get a list of flags and what they do.'),

            fields: flags.more ? Object.keys(this.flagOptions).map(flag => ({
                name: this.capitaliseStart(flag), value: this.flagOptions[flag].description })) : []
        });
    }
}

export default FlagsCommand;
