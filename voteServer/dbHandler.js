const mongoose = require('mongoose');

class DBHandler {
    constructor(base) {
        this.base = base;

        this.url = this.base.config.db.url;
        this.options = this.base.config.db.options;

        this.userSchema = {
            id: { type: String, required: true },
            voted: { type: Date, required: true }
        }
    }

    _connected() {
        console.log('Connected to database.');
        this.base.emit('db');
    }

    connect() {
        console.log('Connecting to database...');

        this.base.db = mongoose;

        try {
            this.base.db.connect(this.url, this.options);
        } catch (err) { throw err; }

        this.base.db.set('useFindAndModify', false);
        this.base.db.model('user', this.userSchema);

        this.base.db.connection.on('connected', this._connected.bind(this));
    }

    async update(ID, data) {
        data = data || {};

        return await this.base.db.model('user').findOneAndUpdate({ id: ID }, data,
            { 'upsert': true, 'setDefaultsOnInsert': true, 'new': true });
    }
}

module.exports = DBHandler;