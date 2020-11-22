import Event from '../structures/Event';

/**
 * Error event.
 */
export default class Error extends Event {
    /**
     * Creates an instance of Error.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, 'error');
    }

    /**
     * Runs when event is triggered.
     *
     * @param {Object} event Event data
     * @returns {undefined}
     */
    onEvent(event) {
        this.client.util.log.error(event);
    }
}
