import os from 'os';

import Command from '../structures/Command';
import packageInfo from '../../package.json';

/**
 * Info command.
 */
export default class Info extends Command {
    /**
     * Creates an instance of Info.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            name: 'info',
            aliases: null,
            description: 'Information and statistics about the bot.',
            arguments: null,
            flags: null,
            toggleable: true,
            developerOnly: false,
            hideInHelp: false,
            weight: 50,
        });
    }

    /**
     * Gets how long the bot has been up since last restart.
     *
     * @returns {string}
     */
    getUptime() {
        const uptime = new Date(new Date() - this.client.start);

        const months = uptime.getUTCMonth();
        const days = uptime.getUTCDate() - 1;
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();

        let uptimeParsed = '';

        if (months) uptimeParsed += `${months} ${this.data.plural('Month', months)}, `;
        if (days) uptimeParsed += `${days} ${this.data.plural('Day', days)}, `;
        if (hours) uptimeParsed += `${hours} ${this.data.plural('Hour', hours)}, `;
        if (minutes) uptimeParsed += `${minutes} ${this.data.plural('Minute', minutes)}, `;
        if (seconds) uptimeParsed += `${seconds} ${this.data.plural('Second', seconds)}`;

        return uptimeParsed;
    }

    /**
     * Converts bytes to human readable version.
     *
     * @param {number} bytes Bytes
     * @returns {string}
     */
    formatBytes(bytes) {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
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
        const navigation = this.data.join([
            '[Invite Bot](https://bit.ly/2PXWYLR)',
            '[Support Server]( https://bit.ly/2kYFRPh)',
            '[Source Code](https://github.com/discord-movie-database/)',
        ]);

        try {
            return this.embed.info(message, {
                title: 'DMDb Information',
                description:
                    `Data provided by The Movie Database ([TMDb](https://tmdb.org/))\n` +
                    `\n${navigation}`,

                thumbnail: { url: 'https://i.imgur.com/ogiqJHb.png' },

                fields: this.fields.fieldsLayout([
                    {
                        name: 'Bot Version',
                        value: packageInfo.version,
                    },

                    {
                        name: 'Library',
                        value: `Eris ${packageInfo.dependencies.eris}`,
                    },

                    {
                        name: 'Node Version',
                        value: `${process.versions.node}`,
                    },

                    {
                        name: 'Guilds',
                        value: `${this.data.number(this.client.guilds.size)}`,
                    },

                    {
                        name: 'Channels',
                        value: `${this.data.number(
                            Object.keys(this.client.channelGuildMap).length
                        )}`,
                    },

                    {
                        name: '-',
                        value: `-`,
                    },

                    {
                        name: 'Shard Count',
                        value: `${this.client.shards.size}`,
                    },

                    {
                        name: 'Current Shard',
                        value: `${message.channel.guild.shard.id}`,
                    },

                    {
                        name: 'Commands Executed',
                        value: this.client.command.executed + 1,
                    },

                    {
                        name: 'OS Platform',
                        value: os.platform(),
                    },

                    {
                        name: 'OS Free Mem',
                        value: this.formatBytes(os.freemem()),
                    },

                    {
                        name: 'OS Total Mem',
                        value: this.formatBytes(os.totalmem()),
                    },

                    {
                        name: 'Uptime',
                        value: this.getUptime(),
                    },
                ]),
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
