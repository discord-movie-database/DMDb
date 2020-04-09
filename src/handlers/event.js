import HandlerStructure from "../structures/handler";

/**
 * Event handler.
 */
class EventHandler extends HandlerStructure {
    /**
     * Create event handler.
     *
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, "events");
    }

    /**
     * Runs when handlers have finished loading.
     *
     * @param {Object} events - Events
     * @returns {undefined}
     */
    onLoad(events) {
        for (let eventName in events) {
            this.client.on(eventName, (event) => events[eventName].onEvent(event));
        }
    }

    /**
     * Get event.
     *
     * @param {string} eventName - Event name
     * @returns {Object} - Event Object
     */
    getEvent(eventName) {
        return this.events[eventName];
    }
}

export default EventHandler;
