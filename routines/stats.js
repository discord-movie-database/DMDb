import consola from 'consola';

import RoutineStructure from '../structures/routine';

class StatsRoutine extends RoutineStructure {
    constructor(client) {
        super(client, 1000 * 60 * 60 * 8); // 8 Hours

        this.guilds = () => this.client.guilds.size;
        this.channels = () => Object.keys(this.client.channelGuildMap).length;
        this.users = () => this.client.guilds.size;
    }

    run() {
        const stats = { guilds: this.guilds(), channels: this.channels(), users: this.users() };

        this.client.repository.getRepository('stats').insert(stats);

        consola.info(`${stats.guilds} Guilds, ${stats.channels} Channels, ${stats.users} Users.`);
    }
}

export default StatsRoutine;
