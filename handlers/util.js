import HandlerStructure from '../structures/handler';

/**
 * Util handler.
 */
class UtilHandler extends HandlerStructure {
    /**
     * Create util handler.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'util');

        this.loadFiles();
    }

    /**
     * Get util.
     * 
     * @param {String} utilName Util name
     * @returns {Object} Util
     */
    getUtil(utilName) {
        return this.util[utilName];
    }
}

export default UtilHandler;
