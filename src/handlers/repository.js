import mongoose from 'mongoose';

import HandlerStructure from '../structures/handler';

/**
 * Repository handler.
 * 
 * @prop {*} db - Mongoose module
 */
class RepositoryHandler extends HandlerStructure {
    /**
     * Create repository handler.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'repository');
        
        this.db = mongoose;

        this.loadFiles();
        this.connect();
    }

    /**
     * Connects to database.
     * 
     * @returns {undefined}
     */
    connect() {
        this.db.set('useFindAndModify', false);

        this.db.connect(
            `mongodb://${this.client.config.db.host}:${this.client.config.db.port}/` +
            `${this.client.config.db.name}`, this.client.config.db.options
        );

        this.db.connection.on('open', () => {
            this.client.log.success('Connected to database.');

            this.client.emit('db');
        });
    }

    /**
     * Get repository.
     * 
     * @param {string} repositoryName - Repository name
     * @returns {Object} Repository Object
     */
    getRepository(repositoryName) {
        return this.repository[repositoryName];
    }
}

export default RepositoryHandler;
