import consola from 'consola';

import EventStructure from '../structures/event';

/**
 * Error event.
 */
class ErrorEvent extends EventStructure {
    /**
     * Create error event.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Function to run when event triggers.
     * 
     * @param {*} event - Event
     * @returns {undefined}
     */
    onEvent(event) {
        consola.error(event);
    }
}

export default ErrorEvent;
