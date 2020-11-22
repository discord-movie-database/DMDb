import Command from '../structures/Command';

/**
 * Eval command.
 */
export default class Eval extends Command {
    /**
     * Creates an instance of Eval.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: null,
            description: 'Developer only command for testing.',
            arguments: '<expression>',
            flags: null,
            toggleable: false,
            developerOnly: true,
            hideInHelp: true,
            weight: 0,
        });
    }

    /**
     * Runs when the command is executed.
     *
     * @param {Object} message Message data
     * @param {string} commandArgs Command arguments
     * @param {Object} guildSettings Guild settings
     * @returns {Promise<undefined>}
     */
    async execute(message, commandArgs, guildSettings) {
        try {
            if (commandArgs.length === 0) return this.invalidArgsMessage(message);

            const output = eval(commandArgs);

            return this.embed.success(message, `${output}` || 'No Content.');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    getShardInfo() {
        const guildCounts = new Array(this.client.shards.size).fill(0);

        this.client.guilds.forEach((guild) => {
            guildCounts[guild.shard.id] += 1;
        });

        const shardInfo = this.client.shards.map(
            (shard) =>
                `**${shard.id}** | ${shard.status} | ` +
                `${shard.latency}ms | ${guildCounts[shard.id]}`
        );

        return shardInfo.join('\n');
    }
}
