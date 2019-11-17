import CommandStructure from '../structures/command';

/**
 * Eval command. Developer command to run simple expressions from a command.
 */
class EvalCommand extends CommandStructure {
    /**
     * Create eval command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Developer only command for testing.',
            usage: '<expression>',
            flags: false,
            developerOnly: true,
            hideInHelp: true,
            weight: 0
        });
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Check for arguments.
        if (commandArguments.length === 0) return this.usageMessage(message);

        // Evaluate expression.
        try { // Success
            const evaluated = eval(message.content);

            this.embed.success(message.channel.id, `${evaluated}` || 'No Content.');
        } catch (error) { // Error
            this.client.log.error(error);

            this.embed.error(message.channel.id, 'There was an error.');
        }
    }
}

export default EvalCommand;
