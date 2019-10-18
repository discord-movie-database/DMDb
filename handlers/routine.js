import HandlerStructure from '../structures/handler';

class RoutinesHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'routines');

        this.loadFiles();
    }
}

export default RoutinesHandler;
