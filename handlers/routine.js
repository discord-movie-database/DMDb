import HandlerStructure from '../structures/handler';

class RoutinesHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'routines');

        this.loadFiles();
    }

    getRoutine(routineName) {
        return this.routines[routineName];
    }
}

export default RoutinesHandler;
