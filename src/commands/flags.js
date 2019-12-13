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
     * @returns {*} A bit of everything...
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for flags.
        const flags = this.flags.parse(message.content, this.meta.flags);

        // Create flag embed.
        this.embed.create(message.channel.id, {
            title: 'Flags',
            description: 'Flags give you an easy command-line style method to filter through ' +
                'results. A flag starts with a double dash (`--`) followed by the flag name and ' +
                'sometimes an argument. The argument is anything after the flag name seperated ' +
                'by a space and ending with a space or nothing if it\'s the end of the message. ' +
                'You can position the flag anywhere in the message after the command name and ' +
                'use multiple flags if the flag hasn\'t already been used.' +

                (flags.more ? '\n\nList of possible flags:' : '\n\nHere are some examples:\n' +
                '`!?movie Endgame --more`\n' +
                '`!?poster George --person Clooney`\n' +
                '`!?movies Thor --page 2 --year 2017`' +

                '\n\nUse the `--more` flag with this command to get a full list of flags and ' +
                'what they do.'),

            // List of flags.
            fields: flags.more ? Object.keys(this.flagOptions).map((flagName) => ({
                name: flagName, value: this.flagOptions[flagName].desc })) : []
        });
    }
}

export default FlagsCommand;
