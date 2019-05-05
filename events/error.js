class ErrorEvent {
    constructor(client) {
        this.client = client;
    }

    process(error) {
        console.error(error);
    }
}

module.exports = ErrorEvent;
