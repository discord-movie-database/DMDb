/**
 * Routine structure.
 *
 * @prop {Object} client Bot client
 * @prop {Object} options Options
 * @prop {number} options.intervalDelay Interval delay
 * @prop {boolean} options.runOnIntervalStart Run on interval start?
 * @prop {boolean} options.productionOnly Run in production only?
 * @prop {Timeout} interval Routine interval
 */
export default class Routine {
    /**
     * Creates an instance of Routine.
     *
     * @param {Object} client Bot client
     * @param {Object} [options] Options
     * @param {number} [options.intervalDelay] Interval delay
     * @param {boolean} [options.runOnIntervalStart] Run on interval start?
     * @param {boolean} [options.productionOnly] Run in production only?
     */
    constructor(client, options) {
        this.client = client;

        this.options = {
            intervalDelay: 1000 * 60 * 60 * 24,
            runOnIntervalStart: true,
            productionOnly: false,

            ...options,
        };

        this.interval = null;
    }

    /**
     * Starts a routine.
     *
     * @returns {undefined}
     */
    start() {
        const { env } = this.client.config;

        if (env === 'prod' || (env !== 'prod' && !this.options.productionOnly)) {
            this.interval = setInterval(() => this.run(), this.options.intervalDelay);

            if (this.options.runOnIntervalStart) this.run();
        }
    }
}
