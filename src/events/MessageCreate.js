import Event from '../structures/Event';

/**
 * Message create event.
 */
export default class MessageCreate extends Event {
    /**
     * Creates an instance of MessageCreate.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, 'messageCreate');
    }

    /**
     * Runs when event is triggered.
     *
     * @param {Object} event Event data
     * @returns {undefined}
     */
    onEvent(event) {
        this.client.command.executeCommand(event);
    }
}
