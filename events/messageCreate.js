import EventStructure from '../structures/event';

/**
 * Message create event.
 */
class MessageCreateEvent extends EventStructure {
    /**
     * Create message create event.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Function to run when event triggers.
     * 
     * Handle commands in command handler.
     * 
     * @returns {undefined}
     */
    onEvent(event) {
        this.client.command.onMessageEvent(event);
    }
}

export default MessageCreateEvent;
