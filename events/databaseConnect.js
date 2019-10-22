import EventStructure from '../structures/event';

/**
 * Database connect event.
 */
class DatabaseConnectEvent extends EventStructure {
    /**
     * Create database connect event.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Function to run when event triggers.
     * 
     * Attempts to connect to Discord after connected to database.
     * 
     * @returns {undefined}
     */
    onEvent() {
        this.client.log.success('Conncted to database.');

        this.client.connect();
    }
}

export default DatabaseConnectEvent;
