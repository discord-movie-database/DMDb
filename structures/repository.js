class RepositoryStructure {
    constructor(client) {
        this.client = client;

        this.db = this.client.db;
    }
}

export default RepositoryStructure;
