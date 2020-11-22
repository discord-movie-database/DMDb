import Event from '../structures/Event';

/**
 * Ready event.
 */
export default class Ready extends Event {
    /**
     * Creates an instance of Ready.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, 'ready');
    }

    /**
     * Runs when event is triggered.
     *
     * @param {Object} event Event data
     * @returns {undefined}
     */
    onEvent(event) {
        if (this.client.loaded) {
            this.client.util.log.success('Reconncted to Discord.');
        } else {
            const uptime = process.uptime().toFixed(3);
            this.client.util.log.success(`Connected to Discord. Took ${uptime}s.`);

            this.client.routine.startRoutines();
        }

        this.client.loaded = true;
    }
}
