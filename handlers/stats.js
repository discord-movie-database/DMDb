import mongoose from 'mongoose';

class StatsHandler {
    constructor(client) {
        this.client = client;

        this.interval;

        this.guilds = () => this.client.guilds.size;
        this.channels = () => Object.keys(this.client.channelGuildMap).length;
        this.users = () => this.client.guilds.size;

        this.commands = 0;
    }

    get() {
        return {
            guilds: this.guilds(),
            channels: this.channels(),
            users: this.users(),

            commands: this.commands,
        };
    }

    update() {
        mongoose.model('stats').create({ time: new Date(), ...this.get() });
    }

    start() {
        this.update();

        this.interval = setInterval(() => this.update(), 1000 * 60 * 60 * 8); // 8 Hours
    }

    stop() {
        clearInterval(this.interval);
    }
}

export default StatsHandler;
