import RoutineStructure from '../structures/routine';

import axios from 'axios';
import consola from 'consola';

class ListRoutine extends RoutineStructure {
    constructor(client) {
        super(client, 1000 * 60 * 60 * 8, { // 8 hours
            prodOnly: true,
            runOnIntervalStart: true,
        });

        this.guilds = () => this.client.guilds.size;
    }

    run() {
        const guildCount = this.guilds();

        consola.info(`Posting ${guildCount} guilds...`);

        this.discordBotList(guildCount);
        this.discordBots(guildCount);
        this.botsOnDiscord(guildCount);
        this.carbonitex(guildCount);
    }

    async discordBotList(guildCount) {
        const API = this.client.config.list.discordBotList;

        try {
            await axios({
                url: `${API.endpoint}/bots/${this.client.bot.id}/stats`,
                headers: { Authorization: API.token },
                data: { server_count: guildCount },
            });

            consola.success(`Updated ${API.endpoint}`);
        } catch (error) {
            consola.error(error);
        }
    }

    async discordBots(guildCount) {
        const API = this.client.config.list.discordBots;

        try {
            await axios({
                url: `${API.endpoint}/bots/${this.client.bot.id}/stats`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });

            consola.success(`Updated ${API.endpoint}`);
        } catch (error) {
            consola.error(error);
        }
    }

    async botsOnDiscord(guildCount) {
        const API = this.client.config.list.botsOnDiscord;

        try {
            await axios({
                url: `${API.endpoint}/bots/${this.client.bot.id}/guilds`,
                headers: { Authorization: API.token },
                data: { guildCount },
            });
            
            consola.success(`Updated ${API.endpoint}`);
        } catch (error) {
            consola.error(error);
        }
    }

    async carbonitex(guildCount) {
        const API = this.client.config.list.carbonitex;

        try {
            await axios({
                url: API.endpoint,
                data: { key: API.token, servercount: guildCount },
            });
            
            consola.success(`Updated ${API.endpoint}`);
        } catch (error) {
            consola.error(error);
        }
    }
}

export default ListRoutine;
