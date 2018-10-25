const fetch = require('node-fetch');

class ListHandler {
    constructor(client) {
        this.client = client;
    }

    _listInterval() {
        this.updateStats();
        
        this.client.listInterval = setInterval(() => {
            this.updateStats(); }, 43200000);
    }

    async _postStats(site, token) {
        const guilds = this.client.guilds.size;

        const postData = {
            'method': 'POST',
            'body': JSON.stringify({ 'server_count': guilds }),
            'headers': { 'Content-Type': 'application/json', 'Authorization': token } }
        const postResponse = await fetch(`${site}/api/bots/412006490132447249/stats`, postData);

        if (postResponse.error)
            return this.client.handlers.log.error(postResponse.error, `Error posting stats to ${site}`);
    
        this.client.handlers.log.success(`Posted ${guilds} guilds to ${site}`);
    }

    updateStats() {
        this.discordbotsOrg();
        this.botsDiscordPw();
    }

    discordbotsOrg() {
        this._postStats('https://discordbots.org', this.client.config.tokens.botlist.discordbotsOrg);
    }

    botsDiscordPw() {
        this._postStats('https://bots.discord.pw', this.client.config.tokens.botlist.botsDiscordPw);
    }
}

module.exports = ListHandler;