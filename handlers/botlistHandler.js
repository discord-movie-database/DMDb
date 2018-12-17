const request = require('superagent');

class ListHandler {
    constructor(client) {
        this.client = client;

        this.clientID = '412006490132447249';
    }

    listInterval() {
        if (this.client.config.options.bot.postStats)
            this.client.listInterval = setInterval(() => {
                this.updateAllSites(); }, 43200000);
    }

    updateAllSites() {
        this.discordbotsOrg();
        this.discordbotsGg();
    }

    async discordbotsOrg() {
        const guildCount = this.client.guilds.size;

        const endpointPrefix = 'https://discordbots.org/api';
        const endpointURL = `${endpointPrefix}/bots/${this.clientID}/stats`;
        
        let apiResponse;
        try {
            apiResponse = await request.post(endpointURL)
                .set('Authorization', this.client.config.tokens.botlist.discordbotsOrg)
                .send({ 'server_count': guildCount });
        } catch (err) { return console.log(err); }
        if (!apiResponse) return;

        this.client.handlers.log.success(`Posted ${guildCount} guilds to ${endpointPrefix}`);
    }

    async discordbotsGg() {
        const guildCount = this.client.guilds.size;

        const endpointPrefix = 'https://discord.bots.gg/api/v1';
        const endpointURL = `${endpointPrefix}/bots/${this.clientID}/stats`;

        let apiResponse;
        try {
            apiResponse = await request.post(endpointURL)
                .set('Authorization', this.client.config.tokens.botlist.discordBotsGg)
                .send({ 'guildCount': guildCount });
        } catch (err) { return console.log(err); }
        if (!apiResponse) return;

        this.client.handlers.log.success(`Posted ${guildCount} guilds to ${endpointPrefix}`);
    }
}

module.exports = ListHandler;