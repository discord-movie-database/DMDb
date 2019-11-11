/**
 * Routine structure. Runs a function on an interval.
 * 
 * @prop {Object} client DMDb client extends Eris
 * @prop {Boolean} runOnIntervalStart Run on interval start?
 * @prop {Boolean} prodOnly Run in production only?
 * @prop {Number} intervalDuration Run function every x...
 * @prop {*} interval Interval
 */
class RoutineStructure {
    /**
     * Create routine structure.
     * 
     * @param {Object} client DMDb client extends Eris
     * @param {Number} intervalDuration Run function every x...
     * @param {Object} options Routine options
     * @param {Boolean} [options.runOnIntervalStart] Run on interval start?
     * @param {Boolean} [options.prodOnly] Run in production only?
     */
    constructor(client, intervalDuration, options) {
        this.client = client;

        this.runOnIntervalStart = options.runOnIntervalStart;
        this.prodOnly = options.prodOnly;

        this.intervalDuration = intervalDuration || 1000 * 60 * 60 * 16; // 16 hours
        this.interval;
    }

    /**
     * Create routine interval.
     * 
     * @returns {undefined}
     */
    createInterval() {
        this.interval = setInterval(() => this.run(), this.intervalDuration);

        if (this.runOnIntervalStart) this.run();
    }

    /**
     * Start routine interval.
     * 
     * @returns {undefined}
     */
    start() {
        if (this.client.config.env === 'prod') {
            this.createInterval();
        } else if (!this.prodOnly) {
            this.createInterval();
        }
    }

    /**
     * Stop routine interval.
     * 
     * @returns {undefined}
     */
    stop() {
        clearInterval(this.interval);
    }
}

export default RoutineStructure;
