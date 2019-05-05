const mongoose = require('mongoose');
const schemas = require('dmdb-schemas');

class DBHandler {
    constructor(client) {
        this.client = client;
    }

    async connect() {
        const url = `mongodb://localhost:${this.client.config.db.port}` +
            `/${this.client.config.db.name}`;
        const options = this.client.config.db.options;

        const connection = await mongoose.connect(url, options).catch(err => {
            this.client.handlers.log.error('', err);
            process.exit();
        });

        mongoose.connection.on('connected', () =>
            this.client.handlers.log.success('Connected to database.'));
        mongoose.connection.on('disconnect', () =>
            this.client.handlers.log.warn('Disconnected from database.'));
        
        mongoose.set('useFindAndModify', false);

        mongoose.model('guilds', new mongoose.Schema(schemas.guilds));
        mongoose.model('users', new mongoose.Schema(schemas.users));
        mongoose.model('statistics', new mongoose.Schema(schemas.statistics));
    }

    async getOrUpdate(model, ID, updates) {
        return await mongoose.model(model).findOneAndUpdate(
            { 'id': ID }, updates || {},
            { 'upsert': true, 'setDefaultsOnInsert': true, 'new': true }
        );
    }

    async getOrUpdateGuild(guildID, updates) {
        return await this.getOrUpdate('guilds', guildID, updates);
    }

    async getOrUpdateUser(userID, updates) {
        return await this.getOrUpdate('users', userID, updates);
    }
}

module.exports = DBHandler;
