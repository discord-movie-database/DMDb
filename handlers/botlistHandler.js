const request = require('superagent');

class ListHandler {
    constructor(client) {
        this.client = client;

        this.clientID = this.client.config.options.bot.id;
        this.listData = this.client.config.tokens.botlist;

        this.client.listInterval;
    }

    _success(endpoint) {
        this.client.handlers.log.success(`Posted guilds to ${endpoint}`);
    }

    startListInterval() {
        if (this.client.env === 'main' & this.client.config.options.bot.postStats)
            this.client.listInterval = setInterval(() => {
                this.updateAllLists(); }, 1000 * 60 * 60 * 8);
    }

    updateAllLists() {
        const guildCount = this.client.guilds.size;

        this.client.handlers.log.info(`Posting ${guildCount} guilds...`);

        this.discordbotsOrg(guildCount);
        this.discordbotsGg(guildCount);
        this.botsOndiscordXyz(guildCount);
        this.carbonitexNet(guildCount);
    }

    async discordbotsOrg(guildCount) {
        const endpointURL = `${this.listData.discordbotsOrg.url}/bots/${this.clientID}/stats`;
        
        const apiResponse = await request.post(endpointURL)
            .set('Authorization', this.listData.discordbotsOrg.token)
            .send({ server_count: guildCount }).catch(console.error);
        if (!apiResponse) return;

        this._success(this.listData.discordbotsOrg.url);
    }

    async discordbotsGg(guildCount) {
        const endpointURL = `${this.listData.discordbotsGg.url}/bots/${this.clientID}/stats`;

        let apiResponse = await request.post(endpointURL)
            .set('Authorization', this.listData.discordbotsGg.token)
            .send({ guildCount: guildCount }).catch(console.error);
        if (!apiResponse) return;

        this._success(this.listData.discordbotsGg.url);
    }

    async botsOndiscordXyz(guildCount) {
        const endpointURL = `${this.listData.botsOndiscordXyz.url}/bots/${this.clientID}/guilds`;

        let apiResponse = await request.post(endpointURL)
            .set('Authorization', this.listData.botsOndiscordXyz.token)
            .send({ guildCount: guildCount }).catch(console.error);
        if (!apiResponse) return;

        this._success(this.listData.botsOndiscordXyz.url);
    }

    async carbonitexNet(guildCount) {
        let apiResponse = await request.post(this.listData.carbonitexNet.url).send({
            key: this.listData.carbonitexNet.token, servercount: guildCount }).catch(console.error);
        if (!apiResponse) return;

        this._success(this.listData.carbonitexNet.url);
    }
}

module.exports = ListHandler;
