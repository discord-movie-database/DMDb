class StatusHandler {
    constructor(client) {
        this.client = client;

        this.prefix = `${this.client.config.bot.prefix}help`;
        this.seperator = ' | ';

        this.interval;
        this.position = 0;

        this.values = [
            () => this.config.status,
            () => `${this.client.guilds.size} Servers`,
            () => `${this.client.users.size} Users`
        ];
    }

    start() {
        this.interval = setInterval(() => this.update(), 1000 * 60 / 2); // 30 Seconds
    }

    update() {
        const value = this.values[this.position]();
        this.client.editStatus({ name: this.prefix + this.seperator + value });

        this.position !== this.values.length - 1 ? this.position++ : this.position = 0;
    }

    stop() {
        clearInterval(this.interval);
    }
}

export default StatusHandler;
