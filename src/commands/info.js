import CommandStructure from '../structures/command';

import os from 'os';
import packageInfo from '../../package.json';

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
        const uptime = new Date(new Date() - this.client.start);

        const years = uptime.getUTCFullYear() - 1970;
        const months = uptime.getUTCMonth();
        const days = uptime.getUTCDate() - 1;
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();

        let uptimeParsed = '';

        if (years) uptimeParsed += `${years} Year${this.fields.plural(years)}, `;
        if (months) uptimeParsed += `${months} Month${this.fields.plural(months)}, `;
        if (days) uptimeParsed += `${days} Day${this.fields.plural(days)}, `;
        if (hours) uptimeParsed += `${hours} Hour${this.fields.plural(hours)}, `;
        if (minutes) uptimeParsed += `${minutes} Minute${this.fields.plural(minutes)}, `;
        if (seconds) uptimeParsed += `${seconds} Second${this.fields.plural(seconds)}`;

        return uptimeParsed;
    }

    /**
     * Converts bytes to human readable version.
     *
     * @param {number} bytes Bytes
     * @returns {string} Human readable
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        // Create embed.
        this.embed.create(message.channel.id, {
            title: 'DMDb Information',
            description: this.fields.join([
                '[Invite Bot](https://bit.ly/2PXWYLR)',
                '[Support Server]( https://bit.ly/2kYFRPh)',
                '[Source Code](https://github.com/discord-movie-database/)',
            ]),

            thumbnail: { url: 'https://i.imgur.com/ogiqJHb.png' },

            fields: this.fields.checkFields([{
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
                value: `${this.fields.number(this.stats.getGuilds())}`,
            }, {
                name: 'Channels',
                value: `${this.fields.number(this.stats.getChannels())}`,
            }, {
                name: 'Users',
                value: `${this.fields.number(this.stats.getUsers())}`,
            }, {
                name: 'Shard Count',
                value: `${this.client.shards.size}`,
            }, {
                name: 'Current Shard',
                value: `${message.channel.guild.shard.id}`,
            }, {
                name: 'Commands Executed',
                value: this.client.command.commandsExecuted + 1,
            }, {
                name: 'OS Platform',
                value: os.platform(),
            }, {
                name: 'OS Free Memory',
                value: this.formatBytes(os.freemem()),
            }, {
                name: 'OS Total Memory',
                value: this.formatBytes(os.totalmem()),
            }, {
                name: 'Uptime',
                value: this.uptime(),
            }]),
        });
    }
}

export default InfoCommand;
