import consola from 'consola';

import EventStructure from '../structures/event';

class ErrorEvent extends EventStructure {
    constructor(client) {
        super(client);
    }

    onEvent(event) {
        consola.error(event);
    }
}

export default ErrorEvent;
