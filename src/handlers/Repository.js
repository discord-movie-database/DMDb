import mongoose from 'mongoose';

import Handler from '../structures/Handler';

import Guilds from '../repository/Guilds';

/**
 * Repository handler.
 *
 * @prop {Guilds} guilds Guilds repository
 */
export default class Repository extends Handler {
    /**
     * Creates an instance of Repository.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.guilds = new Guilds(this.client);
    }

    /**
     * Connects to database.
     *
     * @returns {undefined}
     */
    connect() {
        const config = this.client.config.db;
        const url = `mongodb://${config.host}:${config.port}/${config.name}`;

        mongoose.set('useFindAndModify', false);

        mongoose.connect(url, config.options);

        mongoose.connection.on('open', () => {
            this.client.util.log.success(`Connected to database.`);

            if (!this.client.loaded) this.client.emit('db');
        });
    }
}
