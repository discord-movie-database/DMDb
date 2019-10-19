import EventStructure from '../structures/event';

class ReadyEvent extends EventStructure {
    constructor(client) {
        super(client);
    }

    onEvent() {
        this.client.log.success('Connected to Discord.');

        this.client.loaded = true;

        for (let routineName in this.client.routine.routines) {
            this.client.routine.getRoutine(routineName).start();
        }
    }
}

export default ReadyEvent;
