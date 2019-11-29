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

    getShardInfo() {
        let shardsInfo = '';
        let shardsGuildCount = new Array(this.client.shards.size).fill(0);

        this.client.guilds.forEach((guild) => {
            shardsGuildCount[guild.shard.id]++
        });

        this.client.shards.forEach((shard) => {
            shardsInfo += `**${shard.id}** | ${shard.status} | `
                + `${shard.latency}ms | ${shardsGuildCount[shard.id]} guilds\n`
        });

        return shardsInfo;
    }

    getLargeGuilds() {
        let guildsInfo = '';
        let largeGuilds = [];

        this.client.guilds.forEach((guild) => {
            if (guild.large) largeGuilds.push(guild);
        });

        largeGuilds.forEach((guild) => {
            guildsInfo += `**${guild.name}** (${guild.id}) | m${guild.memberCount} | `
                + `s${guild.shard.id}\n`;
        });

        return guildsInfo;
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
