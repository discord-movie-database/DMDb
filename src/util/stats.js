import UtilStructure from "../structures/util";

class StatsUtil extends UtilStructure {
    constructor(client) {
        super(client);
    }

    getGuilds() {
        return this.client.guilds.size;
    }
    
    getChannels() {
        return Object.keys(this.client.channelGuildMap).length;
    }

    getUsers() {
        return this.client.users.size;
    }
}

export default StatsUtil;
