import EventStructure from '../structures/event';

class DatabaseConnectEvent extends EventStructure {
    constructor(client) {
        super(client);
    }

    onEvent() {
        this.client.log.success('Conncted to database.');

        this.client.connect();
    }
}

export default DatabaseConnectEvent;
