import RoutineStructure from '../structures/routine';

/**
 * List routine. Updates guild count for bot list sites.
 * 
 * @prop {Function} guilds - Guild count
 */
class ListRoutine extends RoutineStructure {
    /**
     * Create list routine.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, 1000 * 60 * 60 * 8, { // 8 hours
            prodOnly: true,
            runOnIntervalStart: true,
        });

        this.guilds = () => this.client.guilds.size;
    }

    /**
     * Function to run on interval.
     * 
     * @returns {undefined}
     */
    run() {
        const guildCount = this.guilds();

        this.client.log.info(`Posting ${guildCount} guilds...`);

        this.discordBotList(guildCount);
        this.discordBots(guildCount);
        this.botsOnDiscord(guildCount);
        this.carbonitex(guildCount);
    }

    /**
     * Update guilds for discordbots.org.
     * 
     * @param {number} guildCount - Guild count
     */
    async discordBotList(guildCount) {
        const API = this.client.config.list.discordBotList;

        try {
            await this.client.axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/stats`,
                headers: { Authorization: API.token },
                data: { server_count: guildCount },
            });

            this.client.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.log.error(error);
        }
    }

    /**
     * Update guilds for discord.bots.gg.
     * 
     * @param {number} guildCount - Guild count
     */
    async discordBots(guildCount) {
        const API = this.client.config.list.discordBots;

        try {
            await this.client.axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/stats`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });

            this.client.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.log.error(error);
        }
    }

    /**
     * Update guilds for bots.ondiscord.xyz.
     * 
     * @param {number} guildCount - Guild count
     */
    async botsOnDiscord(guildCount) {
        const API = this.client.config.list.botsOnDiscord;

        try {
            await this.client.axios({
                method: 'POST',
                url: `${API.endpoint}/bots/${this.client.user.id}/guilds`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });
            
            this.client.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.log.error(error);
        }
    }

    /**
     * Update guilds for carbonitex.net.
     * 
     * @param {number} guildCount - Guild count
     */
    async carbonitex(guildCount) {
        const API = this.client.config.list.carbonitex;

        try {
            await this.client.axios({
                method: 'POST',
                url: API.endpoint,
                data: { key: API.token, servercount: guildCount },
            });
            
            this.client.log.success(`Updated ${API.endpoint}`);
        } catch (error) {
            this.client.log.error(error);
        }
    }
}

export default ListRoutine;
