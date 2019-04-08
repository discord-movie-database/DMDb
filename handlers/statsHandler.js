class StatsHandler {
    constructor(client) {
        this.client = client;
    }

    getStats() {
        return {
            'users': this.client.users.size,
            'channels': Object.keys(this.client.channelGuildMap).length,
            'guilds': this.client.guilds.size,
            'commands': Object.keys(this.client.commands).length
        }
    }

    updateStats() {
        const stats = this.getStats();

        this.client.db.model('bstats').create({
            'date': new Date(),
            ...stats
        });
    }

    startStatsInterval() {
        if (!this.client.config.options.bot.updateStats) return;

        this.updateStats();
        this.client.statsInterval = setInterval(() =>
            this.updateStats(), 1000 * 60 * 60 * 12);

    }
}

module.exports = StatsHandler;
