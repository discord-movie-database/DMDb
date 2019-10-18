import RoutineStructure from '../structures/routine';

class StatsRoutine extends RoutineStructure {
    constructor(client) {
        super(client, 1000 * 60 * 60 * 8); // 8 Hours

        this.guilds = () => this.client.guilds.size;
        this.channels = () => Object.keys(this.client.channelGuildMap).length;
        this.users = () => this.client.guilds.size;
    }

    run() {
        this.client.repository.stats.insert({
            guilds: this.guilds(),
            channels: this.channels(),
            users: this.users(),
        });
    }
}

export default StatsRoutine;
