class BotHandler {
    constructor(client) {
        this.client = client;
        this.config = this.client.config.options.bot;

        this.status = {};
        this.status.position = 0;
        this.status.interval;
        this.status.values = [
            () => this.config.status,
            () => `${this.client.guilds.size} Servers`,
            () => `${this.client.users.size} Users`
        ];
    }

    startStatusInterval() {
        this.status.interval = setInterval(() => {
            this.client.editStatus({'name': `${this.config.prefix}Help | ` +
                `${this.status.values[this.status.position]()}` });

            this.status.position !== this.status.values.length - 1
                ? this.status.position++ : this.status.position = 0;
        }, 30000);
    }

    stopStatusInterval() {
        clearInterval(this.status.interval);
    }
}

module.exports = BotHandler;
