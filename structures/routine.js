class RoutineStructure {
    constructor(client, intervalDuration, options) {
        this.client = client;

        this.runOnIntervalStart = options.runOnIntervalStart;
        this.prodOnly = options.prodOnly;

        this.intervalDuration = intervalDuration || 1000 * 60 * 60 * 16; // 16 hours
        this.interval;
    }

    createInterval() {
        this.interval = setInterval(() => this.run(), this.intervalDuration);

        if (this.runOnIntervalStart) this.run();
    }

    start() {
        if (this.client.config.env === 'prod') {
            this.createInterval();
        } else if (!this.prodOnly) {
            this.createInterval();
        }
    }
    
    stop() {
        clearInterval(this.interval);
    }
}

export default RoutineStructure;
