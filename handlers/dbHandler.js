const mongoose = require('mongoose');

class DBHandler {
    constructor(client) {
        this.client = client;

        this.dbURL = 'mongodb://localhost/dmdb';
    }

    async connect() {
        this.client.db = mongoose;
        this.client.db.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));

        
        await mongoose.connect(this.dbURL,  {
            useNewUrlParser: true });
    }
}

module.exports = DBHandler;