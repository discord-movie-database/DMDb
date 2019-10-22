import UtilStructure from '../structures/util';

/**
 * General util. Functions that don't fit anywhere else.
 */
class GeneralUtil extends UtilStructure {
    /**
     * Create general util structure.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Converts array into string.
     * 
     * @param {Array} array List items
     * @returns {String} List seperated by commas
     */
    list(array) {
        return array.join(', ');
    }

    /**
     * Splits array into chunks.
     * 
     * @param {Array} array Original array
     * @param {Number} size Chunk size
     * @returns {Array} Array of arrays
     */
    splitArray(array, size) {
        const temp = array.slice();
        const chunks = [];

        while (temp.length > 0) {
            chunks.push(temp.splice(0, size));
        }

        return chunks;
    }
}

export default GeneralUtil;
