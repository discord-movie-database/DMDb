/**
 * Event structure.
 * 
 * @prop {Object} client - DMDb client extends Eris
 */
class EventStructure {
    /**
     * Create event structure.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        this.client = client;
    }
}

export default EventStructure;
