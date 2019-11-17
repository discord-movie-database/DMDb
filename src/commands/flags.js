import CommandStructure from '../structures/command';

/**
 * Flags command. Explains how flags work.
 */
class FlagsCommand extends CommandStructure {
    /**
     * Create flags command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'What flags do and how to use them.',
            usage: false,
            flags: ['more'],
            developerOnly: false,
            hideInHelp: true,
            weight: 0
        });

        this.flagOptions = this.flags.flagOptions;
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);

        // Create flag embed.
        this.embed.create(message.channel.id, {
            title: 'Flags',
            description: 'Flags gives you access to more options for more specific results. A' +
                'flag starts with `--` followed by the flag name and somtimes an argument after. ' +
                'The argument is anything after the flag name seperated by a space and ending by ' +
                'a space or nothing if it\'s the end of the command. You can place the flag ' +
                'anywhere in the query and use multiple flags if the flag hasn\'t already been ' +
                'used.' +
                
                (flags.more ? '\n\nList of possible flags:' : '\n\nHere are some examples:\n' +
                '`!?poster Black Mirror --show`\n`!?poster George --person Clooney`\n' +
                '`!?movies Thor --page 2 --year 2017`\n`!?credits --person George Clooney`' +
                '\n\nUse the `--more` flag with this command to get a list of flags and what ' +
                'they do.'),

            // List flag options.
            fields: flags.more ? Object.keys(this.flagOptions).map((flag) => ({
                name: this.titleCase(flag), value: this.flagOptions[flag].desc })) : []
        });
    }
}

export default FlagsCommand;
