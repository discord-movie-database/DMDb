import HandlerStructure from '../structures/handler';

class EventHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'events');

        this.loadFiles((events) => {
            for (let eventName in events) {
                this.client.on(eventName, (event) => events[eventName].onEvent(event));
            }
        });
    }
}

export default EventHandler;
