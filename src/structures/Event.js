/**
 * Event structure.
 *
 * @prop {Object} client Bot client
 * @prop {string} name Event name
 */
export default class Event {
    /**
     * Creates an instance of Event.
     *
     * @param {Object} client Bot client
     * @param {string} name Event name
     */
    constructor(client, name) {
        this.client = client;

        this.name = name;
    }
}
