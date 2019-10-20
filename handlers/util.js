import HandlerStructure from '../structures/handler';

class UtilHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'util');

        this.loadFiles();
    }

    getUtil(utilName) {
        return this.util[utilName];
    }
}

export default UtilHandler;
