class RoutineStructure {
    constructor(client, intervalDuration, prodOnly) {
        this.client = client;

        this.prodOnly = prodOnly;
        this.intervalDuration = intervalDuration || 1000 * 60 * 60 * 16; // 16 Hours
        this.interval;
    }

    start() {
        if (this.client.config.env === 'prod' && this.prodOnly)
            this.interval = setInterval(() => this.run(), this.intervalDuration);
    }
    
    stop() {
        clearInterval(this.interval);
    }
}

export default RoutineStructure;
