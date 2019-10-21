import HandlerStructure from '../structures/handler';

/**
 * Event handler.
 */
class EventHandler extends HandlerStructure {
    /**
     * Create event handler.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'events');

        this.loadFiles((events) => {
            for (let eventName in events) {
                this.client.on(eventName, (event) => events[eventName].onEvent(event));
            }
        });
    }

    /**
     * Get event.
     * 
     * @param {String} eventName Event name
     * @returns {Object} Event
     */
    getEvent(eventName) {
        return this.events[eventName];
    }
}

export default EventHandler;
