import HandlerStructure from '../structures/handler';

/**
 * Repository handler.
 */
class RepositoryHandler extends HandlerStructure {
    /**
     * Create repository handler.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'repository');

        this.loadFiles();
    }

    /**
     * Get repository.
     * 
     * @param {String} repositoryName Repository name
     * @returns {Object} Repository
     */
    getRepository(repositoryName) {
        return this.repository[repositoryName];
    }
}

export default RepositoryHandler;
