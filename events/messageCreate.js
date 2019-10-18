import EventStructure from '../structures/event';

class MessageCreateEvent extends EventStructure {
    constructor(client) {
        super(client);
    }

    onEvent(event) {
        this.client.command.onMessageEvent(event);
    }
}

export default MessageCreateEvent;
