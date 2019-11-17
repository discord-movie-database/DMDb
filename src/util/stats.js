import UtilStructure from "../structures/util";

/**
 * Stats util.
 */
class StatsUtil extends UtilStructure {
    /**
     * Create stats util.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Get guild count.
     * 
     * @returns {number} - Guild count
     */
    getGuilds() {
        return this.client.guilds.size;
    }
    
    /**
     * Get channel count.
     * 
     * @returns {number} - Channel count
     */
    getChannels() {
        return Object.keys(this.client.channelGuildMap).length;
    }

    /**
     * Get user count.
     * 
     * @returns {number} - User count
     */
    getUsers() {
        return this.client.users.size;
    }
}

export default StatsUtil;
