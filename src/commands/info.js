import packageInfo from '../../package.json';
import CommandStructure from '../structures/command';

/**
 * Info command. Get information and stats about the bot.
 */
class InfoCommand extends CommandStructure {
    /**
     * Create info command.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, {
            description: 'Information and statistics about the bot.',
            usage: false,
            flags: false,
            developerOnly: false,
            hideInHelp: false,
            weight: 50
        });

        this.stats = this.client.util.getUtil('stats');
    }

    /**
     * Get how long the bot has been up since last restart.
     * 
     * @returns {undefined}
     */
    uptime() {
        const uptime = new Date(this.client.uptime);

        const years = uptime.getUTCFullYear() - 1970;
        const months = uptime.getUTCMonth();
        const days = uptime.getUTCDate() - 1;
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();

        let uptimeParsed = '';

        if (years) uptimeParsed += `${years} Year${this.plural(years)}, `;
        if (months) uptimeParsed += `${months} Month${this.plural(months)}, `;
        if (days) uptimeParsed += `${days} Day${this.plural(days)}, `;
        if (hours) uptimeParsed += `${hours} Hour${this.plural(hours)}, `;
        if (minutes) uptimeParsed += `${minutes} Minute${this.plural(minutes)}, `;
        if (seconds) uptimeParsed += `${seconds} Second${this.plural(seconds)}`;

        return uptimeParsed;
    }

    /**
     * Function to run when command is executed.
     * 
     * @param {Object} message - Message object
     * @param {Array} commandArguments - Command arguments
     * @param {Object} guildSettings - Guild settings
     */
    async executeCommand(message, commandArguments, guildSettings) {
        // Create embed.
        this.embed.create(message.channel.id, {
            title: 'DMDb Information',
            description: this.join([
                '[Invite Bot](https://bit.ly/2PXWYLR)',
                '[Support Server]( https://bit.ly/2kYFRPh)',
                '[Source Code](https://github.com/discord-movie-database/)',
                '[Website](https://dmdb.xyz)'
            ]),

            thumbnail: 'https://i.imgur.com/ogiqJHb.png',

            fields: this.fields([{
                name: 'Bot Version',
                value: packageInfo.version,
            }, {
                name: 'Library',
                value: `Eris ${packageInfo.dependencies.eris}`,
            }, {
                name: 'Node Version',
                value: `${process.versions.node}`,
            }, {
                name: 'Guilds',
                value: `${this.stats.getGuilds()}`,
            }, {
                name: 'Channels',
                value: `${this.stats.getChannels()}`,
            }, {
                name: 'Users',
                value: `${this.stats.getUsers()}`,
            }, {
                name: 'Shards',
                value: `${this.client.shards.size}`,
            }, {
                name: 'Current Shard',
                value: `${message.channel.guild.shard.id}`,
            }, {
                name: 'Commands Executed',
                value: this.client.command.commandsExecuted + 1,
            }, {
                name: 'Uptime',
                value: this.uptime(),
            }]),
        });
    }
}

export default InfoCommand;
