const mongoose = require('mongoose');

class DBHandler {
    constructor(client) {
        this.client = client;
        this.client.db = mongoose;

        this.guildSchema = {
            id: String,
            prefix: { type: String, default: null },
            disabledCommands: [ String ],
            messages: {
                commanddisabled: { type: Boolean, default: true } },
            anime: { type: Boolean, default: false },
            tips: { type: Boolean, default: true }
        }
        this.userSchema = {
            id: String,
            voted: Date
        }
    }

    async connect() {
        const url = `mongodb://localhost:${this.client.config.db.port}` +
            `/${this.client.config.db.name}`;
        const options = this.client.config.db.options;

        await mongoose.connect(url, options).catch(err => {
            this.client.handlers.log.error('', err);
            process.exit();
        });

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
