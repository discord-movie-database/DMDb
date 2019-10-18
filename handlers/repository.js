import HandlerStructure from '../structures/handler';

class RepositoryHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'repository');

        this.loadFiles();
    }
}

export default RepositoryHandler;
