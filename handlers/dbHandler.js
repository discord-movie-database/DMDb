const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class DBHandler {
    constructor(client) {
        this.client = client;

        this.dbURL = 'mongodb://localhost/dmdb';
        this.guildSchema = {
            id: String,
            prefix: String,
            disabledCommands: [ String ],
            messages: {
                commandNotFound: false,
                commandDisabled: false
            }
        }
    }

    async connect() {
        this.client.db = mongoose;
        this.client.db.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));

        
        await mongoose.connect(this.dbURL,  {
            useNewUrlParser: true });

        mongoose.model('guild', this.guildSchema);
    }
}

module.exports = DBHandler;