import axios from 'axios';

import Routine from '../structures/Routine';

/**
 * Bot list routine.
 */
export default class BotList extends Routine {
    /**
     * Creates an instance of BotList.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            intervalDelay: 1000 * 60 * 60 * 8,
            runOnIntervalStart: true,
            productionOnly: true,
        });
    }

    /**
     * Runs on interval.
     *
     * @returns {undefined}
     */
    run() {
        const guildCount = this.client.guilds.size;

        this.client.util.log.info(`Updating sites with ${this.client.guilds.size} guilds...`);

        if (this.client.config.list) {
            this.discordBotList(guildCount);
            this.discordBots(guildCount);
            this.botsOnDiscord(guildCount);
            this.carbonitex(guildCount);
        }
    }

    /**
     * Updates guild count for discordbots.org.
     *
     * @param {number} guildCount Guild count
     */
    async discordBotList(guildCount) {
        const API = this.client.config.list.discordBotList;

        try {
            await axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/stats`,
                headers: { Authorization: API.token },
                data: { server_count: guildCount },
            });

            this.client.util.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.util.log.error(error);
        }
    }

    /**
     * Updates guild count for discord.bots.gg.
     *
     * @param {number} guildCount Guild count
     */
    async discordBots(guildCount) {
        const API = this.client.config.list.discordBots;

        try {
            await axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/stats`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });

            this.client.util.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.util.log.error(error);
        }
    }

    /**
     * Updates guild count for bots.ondiscord.xyz.
     *
     * @param {number} guildCount Guild count
     */
    async botsOnDiscord(guildCount) {
        const API = this.client.config.list.botsOnDiscord;

        try {
            await axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/guilds`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });

            this.client.util.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.util.log.error(error);
        }
    }

    /**
     * Updates guild count for carbonitex.net.
     *
     * @param {number} guildCount Guild count
     */
    async carbonitex(guildCount) {
        const API = this.client.config.list.carbonitex;

        try {
            await axios({
                method: 'POST',
                url: API.endpoint,
                data: { key: API.token, servercount: guildCount },
            });

            this.client.util.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.util.log.error(error);
        }
    }
}
