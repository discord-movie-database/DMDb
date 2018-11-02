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
        
        try {
            await mongoose.connect(this.dbURL,  {
                useNewUrlParser: true,
                autoReconnect: true,
                reconnectTries: 10,
                reconnectInterval: 500 });
        } catch (err) {
            this.client.handlers.log.error('', err);

            process.exit();
        }

        this.client.db.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));
            
        this.client.db.connection.on('disconnect', () =>
            this.client.handlers.log.warn('Disconnected from database.'));
        
        mongoose.model('guild', this.guildSchema);
    }
}

module.exports = DBHandler;