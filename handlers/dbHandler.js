const mongoose = require('mongoose');
const schemas = require('dmdb-schemas');

class DBHandler {
    constructor(client) {
        this.client = client;
        this.client.db = mongoose;

        this.guildSchema = schemas.guild;
        this.userSchema = schemas.user;
        this.statsSchema = schemas.stats;
    }

    async connect() {
        const url = `mongodb://localhost:${this.client.config.db.port}` +
            `/${this.client.config.db.name}`;
        const options = this.client.config.db.options;

        await this.client.db.connect(url, options).catch(err => {
            this.client.handlers.log.error('', err);
            process.exit();
        });

        this.client.db.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));
        this.client.db.connection.on('disconnect', () =>
            this.client.handlers.log.warn('Disconnected from database.'));
        
        this.client.db.set('useFindAndModify', false);

        this.client.db.model('guild', this.guildSchema);
        this.client.db.model('user', this.userSchema);
        this.client.db.model('bstats', this.statsSchema);
    }

    async getOrUpdate(model, ID, updates) {
        return await this.client.db.model(model).findOneAndUpdate(
            { 'id': ID },
            updates || {},
            { 'upsert': true, 'setDefaultsOnInsert': true, 'new': true }
        );
    }

    async getOrUpdateGuild(guildID, updates) {
        return await this.getOrUpdate('guild', guildID, updates);
    }

    async getOrUpdateUser(userID, updates) {
        return await this.getOrUpdate('user', userID, updates);
    }
}

module.exports = DBHandler;
