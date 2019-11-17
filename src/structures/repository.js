/**
 * Repository structure.
 * 
 * @prop {Object} client - DMDb client extends Eris
 */
class RepositoryStructure {
    /**
     * Create repository structure.
     * 
     * @param {Object} client - DMDb client extends Eris
     * @param {Object} db - Mongoose
     */
    constructor(client) {
        this.client = client;

        this.db = this.client.repository.db;
    }
}

export default RepositoryStructure;
