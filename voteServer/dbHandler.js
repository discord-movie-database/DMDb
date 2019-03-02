const mongoose = require('mongoose');

class DBHandler {
    constructor(base) {
        this.base = base;
        this.base.db = mongoose;

        this.userSchema = {
            id: { type: String, required: true },
            voted: { type: Date, required: true }
        }
    }

    _connected() {
        console.log('Connected to database.');
        this.base.emit('db');
    }

    async connect() {
        console.log('Connecting to database...');

        const url = `mongodb://localhost:${this.base.config.db.port}` +
            `/${this.base.config.db.name}`;
        const options = this.base.config.db.options;

        await this.base.db.connect(url, options).catch(err => {
            console.error(err);
            process.exit();
        });

        this.base.db.set('useFindAndModify', false);
        this.base.db.model('user', this.userSchema);

        this.base.db.connection.on('connected', this._connected.bind(this));
    }

    async update(ID, data) {
        return await this.base.db.model('user').findOneAndUpdate({ id: ID }, data || {},
            { 'upsert': true, 'setDefaultsOnInsert': true, 'new': true });
    }
}

module.exports = DBHandler;