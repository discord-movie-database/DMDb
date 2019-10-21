import HandlerStructure from '../structures/handler';

/**
 * Routine handler.
 */
class RoutinesHandler extends HandlerStructure {
    /**
     * Create routine handler.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'routines');

        this.loadFiles();
    }

    /**
     * Get routine.
     * 
     * @param {String} routineName Routine name
     * @returns {Object} Routine
     */
    getRoutine(routineName) {
        return this.routines[routineName];
    }
}

export default RoutinesHandler;
