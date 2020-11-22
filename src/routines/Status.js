import _package from '../../package.json';

import Routine from '../structures/Routine';

/**
 * Status routine.
 *
 * @prop {string} prefix Status value prefix
 * @prop {number} position Current status value position
 * @prop {Array} values Status values
 */
export default class Status extends Routine {
    /**
     * Creates an instance of Status.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client, {
            intervalDelay: 1000 * 60 * 1,
            runOnIntervalStart: true,
            productionOnly: false,
        });

        this.package = _package;

        this.prefix = `${this.client.config.prefix}help | `;

        this.position = 0;
        this.values = [
            () => 'Discord Movie Database',
            () => 'Movies, TV Shows & People',
            () => `${this.client.guilds.size} Servers`,
            () => `v${this.package.version}`,
        ];
    }

    /**
     * Runs on interval.
     *
     * @returns {undefined}
     */
    run() {
        const value = this.values[this.position]();
        this.client.editStatus({ name: this.prefix + value });

        this.position = this.position !== this.values.length - 1 ? this.position + 1 : 0;
    }
}
