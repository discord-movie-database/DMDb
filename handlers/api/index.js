const DMDb = require('./dmdb');

class APIHandler {
    constructor(client) {
        this.dmdb = new DMDb(client);
    }
}

module.exports = APIHandler;
