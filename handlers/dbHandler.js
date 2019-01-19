const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class DBHandler {
    constructor(client) {
        this.client = client;

        this.guildSchema = {
            id: String,
            prefix: { type: String, default: null },
            disabledCommands: [ String ],
            messages: {
                commanddisabled: { type: Boolean, default: true }
            },
            usageCount: { type: Number, default: 0 },
            anime: { type: Boolean, default: false }
        }

        this.userSchema = {
            id: String,
            voted: Date,
            usageCount: { type: Number, default: 0 }
        }
    }

    async connect() {
        this.client.db = mongoose;
        
        try {
            await mongoose.connect(this.client.config.db.url,
                this.client.config.db.options);
        } catch (err) {
            this.client.handlers.log.error('', err);

            process.exit();
        }

        this.client.db.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));
        this.client.db.connection.on('disconnect', () =>
            this.client.handlers.log.warn('Disconnected from database.'));
        
        mongoose.set('useFindAndModify', false);

        mongoose.model('guild', this.guildSchema);
        mongoose.model('user', this.userSchema);
    }

    async getOrUpdate(model, ID, updates) {
        return await mongoose.model(model).findOneAndUpdate({ 'id': ID }, updates || {},
            { 'upsert': true, 'setDefaultsOnInsert': true, 'new': true });
    }

    async getOrUpdateGuild(guildID, updates) {
        return await this.getOrUpdate('guild', guildID, updates);
    }

    async getOrUpdateUser(userID, updates) {
        return await this.getOrUpdate('user', userID, updates);
    }
}

module.exports = DBHandler;