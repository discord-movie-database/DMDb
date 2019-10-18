import HandlerStructure from '../structures/handler';

class RepositoryHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'repository');

        this.loadFiles();
    }

    getRepository(repositoryName) {
        return this.repository[repositoryName];
    }
}

export default RepositoryHandler;
