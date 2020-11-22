import fs from 'fs';

import Handler from '../structures/Handler';

/**
 * Event handler.
 *
 * @prop {string} directory Events directory
 */
export default class Event extends Handler {
    /**
     * Creates an instance of Event.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.events = [];

        this.directory = `${__dirname}/../events`;
    }

    /**
     * Loads an event.
     *
     * @param {string} filename File name of event
     * @returns {Promise<undefined>}
     */
    async loadEvent(filename) {
        try {
            const { default: File } = await import(`${this.directory}/${filename}`);
            const event = new File(this.client);

            this.events.push(event);

            this.client.on(event.name, (...data) => event.onEvent(...data));
        } catch (error) {
            this.client.util.log.error(`There was an error loading ${filename}\n${error.stack}`);
        }
    }

    /**
     * Loads events.
     *
     * @returns {Promise<undefined>}
     */
    async loadEvents() {
        const filenames = fs.readdirSync(this.directory);

        for (let i = 0; i < filenames.length; i += 1) {
            const filename = filenames[i];

            await this.loadEvent(filename);
        }

        const log = `Loaded ${this.events.length} events.`;
        const failedCount = filenames.length - this.events.length;

        if (failedCount > 0) {
            this.client.util.log.warn(`${log} ${failedCount} failed to load.`);
        } else {
            this.client.util.log.success(log);
        }
    }
}
