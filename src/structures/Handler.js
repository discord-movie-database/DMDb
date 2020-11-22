/**
 * Handler structure.
 *
 * @prop {Object} client Bot client
 */
export default class Handler {
    /**
     * Creates an instance of Handler.
     *
     * @param {Object} client Bot client
     */
    constructor(client, directory) {
        this.client = client;

        this.directory = directory;
    }
}
