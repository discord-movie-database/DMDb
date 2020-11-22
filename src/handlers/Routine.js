import fs from 'fs';

import Handler from '../structures/Handler';

/**
 * Routine handler.
 *
 * @prop {Array<Object>} routines Routines
 * @prop {string} directory Routines directory
 */
export default class Routine extends Handler {
    /**
     * Creates an instance of Routine.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.routines = [];

        this.directory = `${__dirname}/../routines`;
    }

    /**
     * Loads a routine.
     *
     * @param {string} filename File name of routine
     * @returns {Promise<undefined>}
     */
    async loadRoutine(filename) {
        try {
            const { default: File } = await import(`${this.directory}/${filename}`);
            const routine = new File(this.client);

            this.routines.push(routine);
        } catch (error) {
            this.client.util.log.error(`There was an error loading ${filename}\n${error.stack}`);
        }
    }

    /**
     * Loads routines.
     *
     * @returns {Promise<undefined>}
     */
    async loadRoutines() {
        const filenames = fs.readdirSync(this.directory);

        for (let i = 0; i < filenames.length; i += 1) {
            const filename = filenames[i];

            await this.loadRoutine(filename);
        }

        const log = `Loaded ${this.routines.length} routines.`;
        const failedCount = filenames.length - this.routines.length;

        if (failedCount > 0) {
            this.client.util.log.warn(`${log} ${failedCount} failed to load.`);
        } else {
            this.client.util.log.success(log);
        }
    }

    /**
     * Starts routines.
     *
     * @returns {undefined}
     */
    startRoutines() {
        for (let i = 0; i < this.routines.length; i += 1) {
            const routine = this.routines[i];

            routine.start();
        }
    }
}
