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
        const guildCount = this.client.guilds.size;

        this.client.handlers.log.info(`Posting ${guildCount} guilds...`);

        this.discordbotsOrg(guildCount);
        this.discordbotsGg(guildCount);
        this.botsOndiscordXyz(guildCount);
    }

    async discordbotsOrg(guildCount) {
        const endpointPrefix = 'https://discordbots.org/api';
        const endpointURL = `${endpointPrefix}/bots/${this.clientID}/stats`;
        
        let apiResponse;
        try {
            apiResponse = await request.post(endpointURL)
                .set('Authorization', this.client.config.tokens.botlist.discordbotsOrg)
                .send({ 'server_count': guildCount });

        } catch (err) { return console.log(err); }
        if (!apiResponse) return;

        this._success(endpointPrefix);
    }

    async discordbotsGg(guildCount) {
        const endpointPrefix = 'https://discord.bots.gg/api/v1';
        const endpointURL = `${endpointPrefix}/bots/${this.clientID}/stats`;

        let apiResponse;
        try {
            apiResponse = await request.post(endpointURL)
                .set('Authorization', this.client.config.tokens.botlist.discordBotsGg)
                .send({ 'guildCount': guildCount });

        } catch (err) { return console.log(err); }
        if (!apiResponse) return;

        this._success(endpointPrefix);
    }

    async botsOndiscordXyz(guildCount) {
        const endpointPrefix = 'https://bots.ondiscord.xyz/bot-api';
        const endpointURL = `${endpointPrefix}/bots/${this.clientID}/guilds`;

        let apiResponse;
        try {
            apiResponse = await request.post(endpointURL)
                .set('Authorization', this.client.config.tokens.botlist.botsOndiscordXyz)
                .send({ 'guildCount': guildCount });

        } catch (err) { return console.log(err); }
        if (!apiResponse) return;

        this._success(endpointPrefix);
    }

    _success(endpoint) {
        this.client.handlers.log.success(`Posted guilds to ${endpoint}`);
    }
}

module.exports = ListHandler;